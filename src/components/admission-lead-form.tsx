"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CloudOff, LoaderCircle, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import type { AssistantLanguage } from "@/lib/ai/contracts";
import {
  buildWhatsAppLeadMessage,
  getLeadCompletionPercentage,
  LEAD_CAMPUSES,
  LEAD_CLASS_LEVELS,
  LEAD_GENDERS,
  LEAD_STREAMS,
  LEAD_TIMINGS,
  LEAD_VISITOR_TYPES,
  leadSchema,
  type LeadDraft,
} from "@/lib/ai/lead";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/utils";

type LeadFormValues = {
  name: string;
  phone: string;
  classLevel: string;
  stream: string;
  studentGender: string;
  preferredCampus: string;
  preferredTiming: string;
  visitorType: string;
  mainQuestion: string;
  consent: boolean;
  website: string;
};

type LeadApiResponse =
  | { ok: true; data: { status: string; stored: boolean; demo: boolean; message: string; developmentStatus?: "stored" | "demo" | "rejected" } }
  | { ok: false; error: { code: string; message: string; retryable: boolean; fields?: Record<string, string>; developmentStatus?: "rejected" } };

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="mt-1.5 text-xs font-semibold text-girls">{message}</p> : null;
}

function issueMap(issues: Array<{ path: PropertyKey[]; message: string }>) {
  const next: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!next[key]) next[key] = issue.message;
  }
  return next;
}

export function AdmissionLeadForm({
  onBack,
  language,
  initialDraft,
  sourcePage,
}: {
  onBack: () => void;
  language: AssistantLanguage;
  initialDraft: LeadDraft;
  sourcePage: string;
}) {
  const roman = language === "roman-ur";
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<LeadFormValues>(() => ({
    name: initialDraft.name ?? "",
    phone: initialDraft.phone ?? "",
    classLevel: initialDraft.classLevel ?? "",
    stream: initialDraft.stream ?? "",
    studentGender: initialDraft.studentGender ?? "",
    preferredCampus: initialDraft.preferredCampus ?? "",
    preferredTiming: initialDraft.preferredTiming ?? "",
    visitorType: initialDraft.visitorType ?? "",
    mainQuestion: initialDraft.mainQuestion ?? "",
    consent: false,
    website: "",
  }));
  const [submissionId] = useState(uuid);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ stored: boolean; message: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const completion = getLeadCompletionPercentage(values as LeadDraft);
  const steps = roman ? ["Aapki details", "Student", "Preference aur consent"] : ["Your details", "Student", "Preferences & consent"];

  const whatsapp = useMemo(() => {
    const message = buildWhatsAppLeadMessage(language, values);
    return whatsappHref(site.whatsapp, message);
  }, [language, values]);

  function update<K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitError(null);
  }

  function validateCurrentStep(): boolean {
    const schemas = [
      leadSchema.pick({ name: true, phone: true, visitorType: true }),
      leadSchema.pick({ classLevel: true, stream: true, studentGender: true }),
      leadSchema.pick({ preferredCampus: true, preferredTiming: true, mainQuestion: true, consent: true }),
    ];
    const fields = [
      { name: values.name, phone: values.phone, visitorType: values.visitorType },
      { classLevel: values.classLevel, stream: values.stream, studentGender: values.studentGender },
      {
        preferredCampus: values.preferredCampus,
        preferredTiming: values.preferredTiming,
        mainQuestion: values.mainQuestion,
        consent: values.consent,
      },
    ];
    const parsed = schemas[step].safeParse(fields[step]);
    if (parsed.success) return true;
    setErrors(issueMap(parsed.error.issues));
    return false;
  }

  function nextStep() {
    if (validateCurrentStep()) setStep((current) => Math.min(steps.length - 1, current + 1));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || result) return;
    const leadInput = {
      name: values.name,
      phone: values.phone,
      visitorType: values.visitorType,
      selectedLanguage: language,
      classLevel: values.classLevel,
      stream: values.stream,
      studentGender: values.studentGender,
      preferredCampus: values.preferredCampus,
      preferredTiming: values.preferredTiming,
      mainQuestion: values.mainQuestion,
      conversationSummary: "",
      sourcePage,
      consent: values.consent,
      status: "New" as const,
    };
    const parsed = leadSchema.safeParse(leadInput);
    if (!parsed.success) {
      setErrors(issueMap(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: values.website, submissionId }),
      });
      const payload = (await response.json()) as LeadApiResponse;
      if (!response.ok || !payload.ok) {
        if (!payload.ok && payload.error.fields) setErrors(payload.error.fields);
        throw new Error(!payload.ok ? payload.error.message : "Unable to submit the enquiry.");
      }
      setResult({ stored: payload.data.stored, message: payload.data.message });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : roman ? "Enquiry submit nahin ho saki. Dobara try karein." : "Unable to submit the enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full min-h-0 flex-col overflow-y-auto bg-cream p-5 sm:p-7">
        <div className="m-auto w-full max-w-lg border border-cream-deep bg-paper p-6 sm:p-8">
          <span className={`flex h-11 w-11 items-center justify-center rounded-full ${result.stored ? "bg-emerald-100 text-emerald-700" : "bg-gold/20 text-ink"}`}>
            {result.stored ? <Check size={21} /> : <CloudOff size={21} />}
          </span>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-girls">
            {result.stored ? (roman ? "Enquiry save ho gayi" : "Enquiry saved") : roman ? "Local demo status" : "Local demo status"}
          </p>
          <h3 className="mt-2 font-display text-3xl text-ink">
            {result.stored ? (roman ? "Shukriya" : "Thank you") : roman ? "Details store nahin huin" : "Details were not stored"}
          </h3>
          <p className="mt-4 text-sm leading-7 text-muted">{result.message}</p>
          {!result.stored ? (
            <p className="mt-4 border-l-2 border-gold bg-cream px-4 py-3 text-xs leading-5 text-muted">
              {roman ? "Google Sheets connected nahin hai. Abhi WhatsApp ya Call se admissions team se rabta karein." : "Google Sheets is not connected. Please use WhatsApp or Call to contact admissions now."}
            </p>
          ) : null}
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <a href={telHref(site.admissionsPhone)} className="button-paper"><Phone size={16} /> {roman ? "Call karein" : "Call admissions"}</a>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="button-ink"><MessageCircle size={16} /> WhatsApp</a>
          </div>
          <button type="button" onClick={onBack} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-ink"><ArrowLeft size={14} /> {roman ? "Chat par wapas" : "Back to assistant"}</button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="flex h-full min-h-0 flex-col bg-cream" noValidate>
      <div className="border-b border-cream-deep bg-paper px-5 py-4 sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-ink"><ArrowLeft size={14} /> {roman ? "Chat par wapas" : "Back to chat"}</button>
          <span className="text-[10px] font-bold uppercase text-girls">{completion}% {roman ? "complete" : "complete"}</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-cream-deep" aria-label={`${completion}% complete`}>
          <div className="h-full bg-gold transition-[width]" style={{ width: `${completion}%` }} />
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none" aria-label="Lead form progress">
          {steps.map((label, index) => (
            <span key={label} className={`min-w-max text-[10px] font-bold uppercase ${index === step ? "text-ink" : index < step ? "text-girls" : "text-muted/60"}`}>
              {index + 1}. {label}
            </span>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
        <motion.div key={step} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="mx-auto max-w-xl">
          {step === 0 ? (
            <fieldset>
              <legend className="font-display text-2xl text-ink">{roman ? "Admissions kis se rabta kare?" : "Who should admissions contact?"}</legend>
              <p className="mt-2 text-sm leading-6 text-muted">{roman ? "Naam aur mobile number required hain. Aapki role optional hai." : "Name and mobile number are required. Your role is optional."}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2"><span className="form-label">{roman ? "Aap kaun hain? (optional)" : "I am a (optional)"}</span><select className="form-control mt-2" value={values.visitorType} onChange={(event) => update("visitorType", event.target.value)}><option value="">{roman ? "Select karein" : "Choose one"}</option>{LEAD_VISITOR_TYPES.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label className="block"><span className="form-label">{roman ? "Naam *" : "Name *"}</span><input autoFocus className="form-control mt-2" value={values.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "lead-name-error" : undefined} /><FieldError id="lead-name-error" message={errors.name} /></label>
                <label className="block"><span className="form-label">{roman ? "Pakistan mobile *" : "Pakistan mobile *"}</span><input className="form-control mt-2" value={values.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" inputMode="tel" placeholder="0300 1234567" maxLength={30} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "lead-phone-error" : undefined} /><FieldError id="lead-phone-error" message={errors.phone} /></label>
              </div>
            </fieldset>
          ) : null}

          {step === 1 ? (
            <fieldset>
              <legend className="font-display text-2xl text-ink">{roman ? "Student ki requirement" : "Student requirement"}</legend>
              <p className="mt-2 text-sm leading-6 text-muted">{roman ? "Class ya programme required hai. Baqi details optional hain." : "Class or programme is required. The remaining details are optional."}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block"><span className="form-label">{roman ? "Class / Programme *" : "Class / Programme *"}</span><select autoFocus className="form-control mt-2" value={values.classLevel} onChange={(event) => update("classLevel", event.target.value)} aria-invalid={Boolean(errors.classLevel)} aria-describedby={errors.classLevel ? "lead-class-error" : undefined}><option value="">{roman ? "Class select karein" : "Choose class"}</option>{LEAD_CLASS_LEVELS.map((option) => <option key={option}>{option}</option>)}</select><FieldError id="lead-class-error" message={errors.classLevel} /></label>
                <label className="block"><span className="form-label">{roman ? "Stream / Group (optional)" : "Stream / group (optional)"}</span><select className="form-control mt-2" value={values.stream} onChange={(event) => update("stream", event.target.value)}><option value="">{roman ? "Select karein" : "Choose stream"}</option>{LEAD_STREAMS.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label className="block sm:col-span-2"><span className="form-label">{roman ? "Student gender (optional)" : "Student gender (optional)"}</span><select className="form-control mt-2" value={values.studentGender} onChange={(event) => update("studentGender", event.target.value)}><option value="">{roman ? "Select karein" : "Choose one"}</option>{LEAD_GENDERS.map((option) => <option key={option}>{option}</option>)}</select></label>
              </div>
            </fieldset>
          ) : null}

          {step === 2 ? (
            <fieldset>
              <legend className="font-display text-2xl text-ink">{roman ? "Preference aur consent" : "Preferences and consent"}</legend>
              <p className="mt-2 text-sm leading-6 text-muted">{roman ? "Campus aur timing preferences seat ki guarantee nahin hain." : "Campus and timing preferences do not guarantee a seat."}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block"><span className="form-label">{roman ? "Preferred campus (optional)" : "Preferred campus (optional)"}</span><select autoFocus className="form-control mt-2" value={values.preferredCampus} onChange={(event) => update("preferredCampus", event.target.value)}><option value="">{roman ? "Campus select karein" : "Choose campus"}</option>{LEAD_CAMPUSES.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label className="block"><span className="form-label">{roman ? "Preferred timing (optional)" : "Preferred timing (optional)"}</span><select className="form-control mt-2" value={values.preferredTiming} onChange={(event) => update("preferredTiming", event.target.value)}><option value="">{roman ? "Timing select karein" : "Choose timing"}</option>{LEAD_TIMINGS.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label className="block sm:col-span-2"><span className="form-label">{roman ? "Sawal (optional)" : "Main question (optional)"}</span><textarea className="form-control mt-2 min-h-20 resize-y" value={values.mainQuestion} onChange={(event) => update("mainQuestion", event.target.value)} maxLength={600} placeholder={roman ? "Admissions team se kya confirm karna hai?" : "What should admissions clarify?"} aria-invalid={Boolean(errors.mainQuestion)} aria-describedby={errors.mainQuestion ? "lead-question-error" : undefined} /><FieldError id="lead-question-error" message={errors.mainQuestion} /></label>
              </div>
              <div className="sr-only" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} /></label></div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 border border-cream-deep bg-paper p-4">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-gold" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "lead-consent-error" : undefined} />
                <span className="text-xs leading-5 text-muted"><strong className="text-ink">{roman ? "Jee, main admission follow-up ki consent deta/deti hoon *" : "I consent to admission follow-up *"}</strong><br />{roman ? "Aapki information sirf admission follow-up ke liye use hogi." : "Your information will only be used for this admission enquiry."}</span>
              </label>
              <FieldError id="lead-consent-error" message={errors.consent} />
              <p className="mt-4 flex gap-2 text-xs leading-5 text-muted"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-gold" />{roman ? "Aapki information sirf admission follow-up ke liye use hogi. Passwords, payment details ya sensitive documents share na karein." : "Your information will only be used by Sir Saqib Tuitions for admission follow-up. Please do not share passwords, payment details or sensitive documents."}</p>
            </fieldset>
          ) : null}

          {submitError ? (
            <div role="alert" className="mt-5 border-l-2 border-girls bg-paper px-4 py-3 text-xs leading-5 text-girls">
              <p>{submitError}</p>
              <p className="mt-1 text-muted">{roman ? "Enquiry save hone ki tasdeeq nahin hui. Dobara try karein ya WhatsApp par details bhej dein." : "The enquiry was not confirmed as saved. Retry, or send the details through WhatsApp."}</p>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-bold text-[#176b50]"><MessageCircle size={13} /> WhatsApp</a>
            </div>
          ) : null}
        </motion.div>
      </div>

      <div className="border-t border-cream-deep bg-paper px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || submitting} className="button-paper disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={15} /> {roman ? "Peechay" : "Previous"}</button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={nextStep} className="button-ink">{roman ? "Aagay" : "Continue"} <ArrowRight size={15} /></button>
          ) : (
            <button type="submit" disabled={submitting || !values.consent} className="button-ink disabled:cursor-not-allowed disabled:opacity-50">{submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />} {roman ? "Enquiry submit karein" : "Submit enquiry"}</button>
          )}
        </div>
      </div>
    </form>
  );
}
