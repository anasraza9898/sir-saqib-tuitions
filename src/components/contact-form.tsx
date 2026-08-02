"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { campuses, programs, site } from "@/data/site";
import { whatsappHref } from "@/lib/utils";

type FormValues = { name: string; phone: string; program: string; campus: string; message: string };
const initialValues: FormValues = { name: "", phone: "", program: "", campus: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState("");
  const whatsappUrl = useMemo(() => {
    const campus = campuses.find((item) => item.id === values.campus);
    const number = campus?.whatsapp ?? site.whatsapp;
    const lines = [
      "Hello, I would like admissions information.",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Program: ${programs.find((item) => item.id === values.program)?.title ?? values.program}`,
      `Campus: ${campus?.name ?? values.campus}`,
      values.message ? `Question: ${values.message}` : "",
    ].filter(Boolean);
    return whatsappHref(number, lines.join("\n"));
  }, [values]);

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (values.name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^[+\d][\d\s-]{8,}$/.test(values.phone.trim())) nextErrors.phone = "Enter a valid phone number.";
    if (!values.program) nextErrors.program = "Select a program.";
    if (!values.campus) nextErrors.campus = "Select a campus.";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("Please correct the highlighted fields.");
      return;
    }

    setStatus("Opening WhatsApp with your enquiry. This website does not store the form submission.");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-md border border-navy-900/10 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow">Admissions enquiry</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy-950">Start on WhatsApp</h2>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-navy-950 text-gold-300"><MessageCircle size={21} /></span>
      </div>
      <p className="mt-3 text-sm leading-6 text-navy-600">Complete the details below to prepare a WhatsApp message. Nothing is saved or submitted to a backend.</p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <FormField label="Parent / student name" error={errors.name}>
          <input className="form-control" name="name" autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} />
        </FormField>
        <FormField label="Phone number" error={errors.phone}>
          <input className="form-control" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="03XX-XXXXXXX" value={values.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} />
        </FormField>
        <FormField label="Program" error={errors.program}>
          <select className="form-control" name="program" value={values.program} onChange={(event) => update("program", event.target.value)} aria-invalid={Boolean(errors.program)}>
            <option value="">Choose a program</option>
            {programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}
          </select>
        </FormField>
        <FormField label="Preferred campus" error={errors.campus}>
          <select className="form-control" name="campus" value={values.campus} onChange={(event) => update("campus", event.target.value)} aria-invalid={Boolean(errors.campus)}>
            <option value="">Choose a campus</option>
            {campuses.map((campus) => <option key={campus.id} value={campus.id}>{campus.name}</option>)}
          </select>
        </FormField>
        <label className="sm:col-span-2">
          <span className="control-label">Question <span className="font-normal text-navy-500">(optional)</span></span>
          <textarea className="form-control mt-2 min-h-28 resize-y" name="message" value={values.message} onChange={(event) => update("message", event.target.value)} />
        </label>
      </div>
      <button type="submit" className="btn-primary mt-6 w-full justify-center sm:w-auto">Prepare WhatsApp enquiry <Send size={17} /></button>
      {status ? <p className="mt-4 text-sm font-medium text-navy-700" role="status">{status}</p> : null}
    </form>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="control-label">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-1.5 block text-xs font-semibold text-burgundy-700">{error}</span> : null}
    </label>
  );
}
