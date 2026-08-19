"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { useWhatsAppChooser } from "@/components/whatsapp-campus-chooser";
import { campuses, programs } from "@/data/site";

type FormValues = { name: string; phone: string; program: string; campus: string; message: string };
const initialValues: FormValues = { name: "", phone: "", program: "", campus: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState("");
  const { openChooser } = useWhatsAppChooser();
  const selectedCampus = campuses.find((item) => item.id === values.campus);
  const whatsappMessage = useMemo(() => {
    const campus = campuses.find((item) => item.id === values.campus);
    const program = programs.find((item) => item.id === values.program);
    return [
      "Hello, I would like admission guidance from Sir Saqib Tuitions.",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Program: ${program?.title ?? values.program}`,
      `Campus: ${campus?.name ?? values.campus}`,
      values.message ? `Question: ${values.message}` : "",
    ].filter(Boolean).join("\n");
  }, [values]);

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (values.name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^[+\d][\d\s-]{8,}$/.test(values.phone.trim())) nextErrors.phone = "Enter a valid phone number.";
    if (!values.program) nextErrors.program = "Choose a program.";
    if (!values.campus) nextErrors.campus = "Choose a campus.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) { setStatus("Please review the highlighted fields."); return; }
    setStatus("Your WhatsApp message is ready. Choose the admissions contact to continue.");
    openChooser({ campusId: selectedCampus?.id, message: whatsappMessage });
  }

  return (
    <form onSubmit={submit} noValidate className="border border-cream-deep bg-paper">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-cream-deep bg-ink p-7 text-white lg:border-b-0 lg:border-r lg:p-9">
          <MessageCircle size={24} className="text-gold-light" />
          <p className="mt-8 text-xs font-bold uppercase text-gold-light">Prepare your enquiry.</p>
          <h2 className="mt-4 font-display text-4xl leading-tight">Prepare your enquiry.</h2>
          <p className="mt-5 text-sm leading-7 text-white/62">Choose a programme and campus. We will prepare a concise WhatsApp message for the relevant admissions contact.</p>
          <div className="mt-8 border-t border-white/12 pt-5">
            <p className="text-xs text-white/48">Message destination</p>
            <p className="mt-2 text-sm font-bold text-white">{selectedCampus?.name ?? "Choose a campus"}</p>
          </div>
        </div>
        <div className="p-6 sm:p-8 lg:p-9">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField id="enquiry-name" label="Parent / student name" error={errors.name}><input id="enquiry-name" className="form-control mt-2" name="name" autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "enquiry-name-error" : undefined} /></FormField>
            <FormField id="enquiry-phone" label="Phone number" error={errors.phone}><input id="enquiry-phone" className="form-control mt-2" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="03XX-XXXXXXX" value={values.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "enquiry-phone-error" : undefined} /></FormField>
            <FormField id="enquiry-program" label="Program" error={errors.program}><select id="enquiry-program" className="form-control mt-2" name="program" value={values.program} onChange={(event) => update("program", event.target.value)} aria-invalid={Boolean(errors.program)} aria-describedby={errors.program ? "enquiry-program-error" : undefined}><option value="">Choose a program</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}</select></FormField>
            <FormField id="enquiry-campus" label="Preferred campus" error={errors.campus}><select id="enquiry-campus" className="form-control mt-2" name="campus" value={values.campus} onChange={(event) => update("campus", event.target.value)} aria-invalid={Boolean(errors.campus)} aria-describedby={errors.campus ? "enquiry-campus-error" : undefined}><option value="">Choose a campus</option>{campuses.map((campus) => <option key={campus.id} value={campus.id}>{campus.name}</option>)}</select></FormField>
            <label className="sm:col-span-2" htmlFor="enquiry-message"><span className="form-label">Question <span className="font-normal text-muted">(optional)</span></span><textarea id="enquiry-message" className="form-control mt-2 min-h-28 resize-y" name="message" value={values.message} onChange={(event) => update("message", event.target.value)} /></label>
          </div>
          <button type="submit" className="button-ink mt-6 w-full sm:w-auto">Prepare WhatsApp Message <ArrowRight size={16} /></button>
          {status ? <p className="mt-4 text-sm font-bold text-text" role="status">{status}</p> : null}
          <p className="mt-6 flex gap-2 border-t border-cream-deep pt-5 text-xs leading-5 text-muted"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-gold" />This enquiry builder prepares your message only. You can review it in WhatsApp before sending it to admissions.</p>
        </div>
      </div>
    </form>
  );
}

function FormField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return <label htmlFor={id}><span className="form-label">{label}</span>{children}{error ? <span id={`${id}-error`} className="mt-1.5 block text-xs font-bold text-girls">{error}</span> : null}</label>;
}
