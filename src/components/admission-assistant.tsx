"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  AlertCircle,
  Bot,
  BookOpen,
  Building2,
  CalendarDays,
  Languages,
  LoaderCircle,
  MessageCircle,
  Phone,
  ReceiptText,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  UserRoundPlus,
  Wifi,
  WifiOff,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AdmissionLeadForm } from "@/components/admission-lead-form";
import { Modal } from "@/components/modal";
import { WhatsAppChooserButton } from "@/components/whatsapp-campus-chooser";
import { site } from "@/data/site";
import {
  CHAT_MAX_TURNS,
  CHAT_MESSAGE_MAX_LENGTH,
  noRecommendedAction,
  type ApiErrorResponse,
  type AssistantLanguage,
  type AssistantMode,
  type ChatMessage,
  type ChatSuccessResponse,
  type RecommendedAction,
} from "@/lib/ai/contracts";
import { buildWhatsAppLeadMessage, mergeLeadDraft, type LeadDraft } from "@/lib/ai/lead";
import { telHref } from "@/lib/utils";

type UiMessage = ChatMessage & { id: string };

type QuickAction = {
  label: string;
  message: string;
  icon: LucideIcon;
};

const LANGUAGE_STORAGE_KEY = "sir-saqib-ai-language";

const welcome: Record<AssistantLanguage, string> = {
  en: "Assalamualaikum and welcome to Sir Saqib Tuitions. I can guide you regarding programmes, fees, campuses, timetables and admissions. Which class or programme are you interested in?",
  "roman-ur": "Assalamualaikum! Sir Saqib Tuitions mein khush aamdeed. Jee, main admissions, courses, fees, campuses aur timetables ke hawalay se aapko guide kar sakta hoon. Student kis class ya programme ke liye interested hai?",
};

const quickActions: Record<AssistantLanguage, QuickAction[]> = {
  en: [
    { label: "Explore Programmes", message: "Which programmes are available?", icon: BookOpen },
    { label: "Check Fees", message: "I want to check the monthly fee for a class.", icon: ReceiptText },
    { label: "Find a Campus", message: "Which academy campuses are available?", icon: Building2 },
    { label: "View Timetables", message: "I need the timetable for a class.", icon: CalendarDays },
    { label: "Admission Process", message: "How is admission completed?", icon: UserRoundPlus },
    { label: "Contact Admissions", message: "I would like admissions staff to contact me.", icon: MessageCircle },
  ],
  "roman-ur": [
    { label: "Programmes Dekhein", message: "Kaun se programmes available hain?", icon: BookOpen },
    { label: "Fees Maloom Karein", message: "Mujhe kisi class ki monthly fee check karni hai.", icon: ReceiptText },
    { label: "Campus Select Karein", message: "Academy ke kaun se campuses hain?", icon: Building2 },
    { label: "Timetable Dekhein", message: "Mujhe kisi class ka timetable chahiye.", icon: CalendarDays },
    { label: "Admission Process", message: "Admission kaise complete hota hai?", icon: UserRoundPlus },
    { label: "Admissions Se Rabta", message: "Main admissions team se rabta karna chahta/chahti hoon.", icon: MessageCircle },
  ],
};

function makeMessage(role: ChatMessage["role"], content: string): UiMessage {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    role,
    content,
  };
}

export function AdmissionAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [language, setLanguage] = useState<AssistantLanguage | null>(null);
  const [languageReady, setLanguageReady] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; retryable: boolean; code?: string } | null>(null);
  const [mode, setMode] = useState<AssistantMode | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recommendedAction, setRecommendedAction] = useState<RecommendedAction>(noRecommendedAction);
  const [leadDraft, setLeadDraft] = useState<LeadDraft>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [sourcePage, setSourcePage] = useState("/");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  const roman = language === "roman-ur";
  const whatsappMessage = useMemo(
    () => buildWhatsAppLeadMessage(language ?? "en", leadDraft),
    [language, leadDraft],
  );

  const close = useCallback(() => {
    requestRef.current?.abort();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open || languageReady) return;
    const timer = window.setTimeout(() => {
      let saved: AssistantLanguage | null = null;
      try {
        const value = window.sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (value === "en" || value === "roman-ur") saved = value;
      } catch {
        saved = null;
      }
      setSourcePage(`${window.location.pathname}${window.location.search}`.slice(0, 200));
      if (saved) {
        setLanguage(saved);
        setMessages([makeMessage("assistant", welcome[saved])]);
      }
      setLanguageReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [languageReady, open]);

  useEffect(() => {
    if (!open || !languageReady) return;
    if (!language) {
      const timer = window.setTimeout(() => languageButtonRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
    if (showLeadForm) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [language, languageReady, open, showLeadForm]);

  useEffect(() => {
    if (!showLeadForm) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [loading, messages, recommendedAction, showLeadForm]);

  useEffect(() => () => requestRef.current?.abort(), []);

  function chooseLanguage(next: AssistantLanguage) {
    requestRef.current?.abort();
    try {
      window.sessionStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // The selection still works when browser storage is unavailable.
    }
    setLanguage(next);
    setMessages([makeMessage("assistant", welcome[next])]);
    setDraft("");
    setError(null);
    setSuggestions([]);
    setRecommendedAction(noRecommendedAction());
    setMode(null);
    setShowLeadForm(false);
    setLeadDraft((current) => ({ ...current, selectedLanguage: next }));
  }

  async function requestReply(conversation: UiMessage[], selectedLanguage = language) {
    if (!selectedLanguage) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setRecommendedAction(noRecommendedAction());
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 22_000);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map(({ role, content }) => ({ role, content })),
          language: selectedLanguage,
          leadState: {
            visitorType: leadDraft.visitorType,
            name: leadDraft.name,
            phone: leadDraft.phone,
            classLevel: leadDraft.classLevel,
            stream: leadDraft.stream,
            studentGender: leadDraft.studentGender,
            preferredCampus: leadDraft.preferredCampus,
            preferredTiming: leadDraft.preferredTiming,
            question: leadDraft.mainQuestion,
          },
        }),
        signal: controller.signal,
      });
      const payload = (await response.json()) as ChatSuccessResponse | ApiErrorResponse;
      if (!response.ok || !payload.ok) {
        const apiError = payload.ok ? null : payload.error;
        setError({
          message: apiError?.message ?? (roman ? "Assistant jawab nahin de saka. Dobara try karein." : "The assistant could not respond. Please try again."),
          retryable: apiError?.retryable ?? true,
          code: apiError?.code,
        });
        return;
      }

      setMode(payload.data.mode);
      setSuggestions(payload.data.suggestions);
      setRecommendedAction(payload.data.recommendedAction);
      setLeadDraft((current) => mergeLeadDraft(current, payload.data.leadUpdate));
      setMessages((current) => [...current, makeMessage("assistant", payload.data.message)].slice(-CHAT_MAX_TURNS));
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError" && !open) return;
      const timedOut = requestError instanceof DOMException && requestError.name === "AbortError";
      setError({
        message: timedOut
          ? roman ? "Request ka waqt khatam ho gaya. Dobara try karein ya Call/WhatsApp use karein." : "The request timed out. Please retry or use Call/WhatsApp."
          : roman ? "Assistant filhaal available nahin. Dobara try karein ya Call/WhatsApp use karein." : "The assistant is unavailable. Please retry or use Call/WhatsApp.",
        retryable: true,
        code: timedOut ? "REQUEST_TIMEOUT" : "PROVIDER_UNAVAILABLE",
      });
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) requestRef.current = null;
      setLoading(false);
    }
  }

  function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!language || !trimmed || trimmed.length > CHAT_MESSAGE_MAX_LENGTH || loading) return;
    const base = error && messages.at(-1)?.role === "user" ? messages.slice(0, -1) : messages;
    const conversation = [...base, makeMessage("user", trimmed)].slice(-CHAT_MAX_TURNS);
    setMessages(conversation);
    setDraft("");
    void requestReply(conversation, language);
  }

  function clearConversation() {
    requestRef.current?.abort();
    try {
      window.sessionStorage.removeItem(LANGUAGE_STORAGE_KEY);
    } catch {
      // Clearing the visible conversation is still sufficient.
    }
    setLanguage(null);
    setMessages([]);
    setDraft("");
    setError(null);
    setSuggestions([]);
    setRecommendedAction(noRecommendedAction());
    setMode(null);
    setLeadDraft({});
    setShowLeadForm(false);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(draft);
    }
  }

  function renderRecommendedAction() {
    const action = recommendedAction;
    if (action.type === "none" || !action.label) return null;
    const classes = "inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-ink px-4 text-[11px] font-bold text-white transition hover:bg-girls";
    if (action.type === "route" && action.value.startsWith("/")) {
      return <Link href={action.value} onClick={close} className={classes}>{action.label}</Link>;
    }
    if (action.type === "call") return <a href={telHref(action.value || site.admissionsPhone)} className={classes}><Phone size={13} />{action.label}</a>;
    if (action.type === "whatsapp") return <WhatsAppChooserButton message={whatsappMessage} className={classes}><MessageCircle size={13} />{action.label}</WhatsAppChooserButton>;
    if (action.type === "lead_form") return <button type="button" onClick={() => setShowLeadForm(true)} className={classes}><UserRoundPlus size={13} />{action.label}</button>;
    return null;
  }

  return (
    <Modal open={open} onClose={close} labelledBy="assistant-title" className="h-[100dvh] overflow-hidden rounded-t-2xl sm:h-[min(760px,90dvh)] sm:max-w-3xl sm:rounded-sm">
      <div className="flex h-full min-h-0 flex-col bg-paper">
        <header className="relative shrink-0 overflow-hidden bg-ink px-4 py-3.5 text-white sm:px-6 sm:py-4">
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Image src="/assets/logo/SST_Logo_T.b.png" alt="Sir Saqib Tuitions official logo" width={44} height={44} className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gold-light">AI admissions consultant</p>
                  {mode === "demo" ? <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2 py-0.5 text-[9px] font-bold uppercase text-white/75"><WifiOff size={10} /> Local guidance</span> : null}
                  {mode === "gemini" ? <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-200"><Wifi size={10} /> Gemini connected</span> : null}
                </div>
                <h2 id="assistant-title" className="mt-1 truncate font-display text-lg sm:text-2xl">Sir Saqib Admissions</h2>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {language ? <button type="button" onClick={() => setLanguage(null)} className="inline-flex h-9 items-center gap-1.5 rounded-sm px-2 text-[10px] font-bold uppercase text-white/75 hover:bg-white/10 hover:text-white" aria-label="Change assistant language"><Languages size={15} />{language === "en" ? "EN" : "RU"}</button> : null}
              <button type="button" onClick={clearConversation} className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-white/70 hover:bg-white/10 hover:text-white" aria-label="Clear conversation"><Trash2 size={17} /></button>
              <button type="button" onClick={close} className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-white/70 hover:bg-white/10 hover:text-white" aria-label="Close admission assistant"><X size={20} /></button>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!language ? (
            <motion.section key="language" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-cream px-5 py-8 sm:px-10 sm:py-12">
              <div className="m-auto w-full max-w-xl">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/20 text-ink"><Languages size={21} /></span>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-girls">Choose your language</p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">How would you like to continue?</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted">Select a language for admissions guidance. You can change it at any time.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button ref={languageButtonRef} type="button" onClick={() => chooseLanguage("en")} className="group border border-ink/12 bg-paper p-5 text-left transition hover:border-gold hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                    <span className="text-xs font-bold uppercase tracking-wider text-girls">English</span>
                    <span className="mt-2 block font-display text-2xl text-ink">Continue in English</span>
                    <span className="mt-2 block text-xs leading-5 text-muted">Clear, professional admissions guidance.</span>
                  </button>
                  <button type="button" onClick={() => chooseLanguage("roman-ur")} className="group border border-ink/12 bg-paper p-5 text-left transition hover:border-gold hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                    <span className="text-xs font-bold uppercase tracking-wider text-girls">Roman Urdu</span>
                    <span className="mt-2 block font-display text-2xl text-ink">Roman Urdu mein</span>
                    <span className="mt-2 block text-xs leading-5 text-muted">Karachi-style, respectful aur asaan guidance.</span>
                  </button>
                </div>
                <p className="mt-6 text-[11px] leading-5 text-muted">Text-only assistant. Please do not share CNIC, passwords, payment details or sensitive documents.</p>
              </div>
            </motion.section>
          ) : showLeadForm ? (
            <motion.div key="lead" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="min-h-0 flex-1">
              <AdmissionLeadForm onBack={() => setShowLeadForm(false)} language={language} initialDraft={leadDraft} sourcePage={sourcePage} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-0 flex-1 flex-col">
              <nav className="shrink-0 border-b border-cream-deep bg-cream px-4 py-2.5 sm:px-6" aria-label="Assistant quick actions">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {quickActions[language].map(({ label, message, icon: Icon }) => (
                    <button key={label} type="button" onClick={() => sendMessage(message)} disabled={loading} className="inline-flex min-h-9 min-w-max items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 text-[11px] font-bold text-ink transition hover:border-gold disabled:opacity-50"><Icon size={14} className="text-girls" />{label}</button>
                  ))}
                </div>
              </nav>

              <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-paper px-4 py-4 sm:px-6 sm:py-5" aria-live="polite" aria-busy={loading}>
                <div className="mx-auto flex max-w-2xl flex-col gap-3">
                  {messages.map((message) => (
                    <motion.div key={message.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={message.role === "user" ? "ml-auto max-w-[86%]" : "mr-auto flex max-w-[94%] items-start gap-2.5"}>
                      {message.role === "assistant" ? <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream text-girls"><Sparkles size={14} /></span> : null}
                      <div className={message.role === "user" ? "rounded-2xl rounded-br-sm bg-ink px-3.5 py-2 text-sm leading-5 text-white" : "rounded-2xl rounded-tl-sm bg-cream px-3.5 py-2.5 text-sm leading-5 text-muted whitespace-pre-line"}>{message.content}</div>
                    </motion.div>
                  ))}

                  {loading ? (
                    <div className="mr-auto flex items-center gap-2.5 text-muted">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream text-girls"><Bot size={14} /></span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-2" aria-label="Assistant is typing"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:240ms]" /></span>
                    </div>
                  ) : null}

                  {error ? (
                    <div role="alert" className="border-l-2 border-girls bg-cream px-4 py-3">
                      <p className="flex gap-2 text-xs leading-5 text-girls"><AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{error.message}{error.code ? <span className="mt-1 block font-bold uppercase tracking-wide text-ink/60">{error.code}</span> : null}</span></p>
                      {error.retryable ? <button type="button" onClick={() => void requestReply(messages)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-girls"><RotateCcw size={13} /> {roman ? "Dobara try karein" : "Retry"}</button> : null}
                    </div>
                  ) : null}

                  {!loading && !error && (suggestions.length > 0 || recommendedAction.type !== "none") ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 pl-9" aria-label="Suggested follow-up actions">
                      {renderRecommendedAction()}
                      {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="rounded-full border border-ink/12 px-3 py-1.5 text-[11px] font-bold text-muted hover:border-gold hover:text-ink">{suggestion}</button>)}
                    </motion.div>
                  ) : null}
                </div>
              </div>

              <div className="shrink-0 border-t border-cream-deep bg-cream px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
                <div className="mx-auto max-w-2xl">
                  <div className="flex items-end gap-2 rounded-sm border border-ink/15 bg-paper p-2 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/15">
                    <textarea ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value.slice(0, CHAT_MESSAGE_MAX_LENGTH))} onKeyDown={onInputKeyDown} rows={1} maxLength={CHAT_MESSAGE_MAX_LENGTH} disabled={loading} placeholder={roman ? "Class, fees ya campus ke bare mein poochhein..." : "Ask about a class, fee or campus..."} aria-label="Message the admissions assistant" className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-ink outline-none placeholder:text-muted/70 disabled:opacity-60" />
                    <button type="button" onClick={() => sendMessage(draft)} disabled={!draft.trim() || loading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-ink text-white disabled:cursor-not-allowed disabled:opacity-35" aria-label="Send message">{loading ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={17} />}</button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-muted"><span>{roman ? "Enter se send karein" : "Enter to send · Shift+Enter for a new line"}</span><span>{draft.length}/{CHAT_MESSAGE_MAX_LENGTH}</span></div>
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-cream-deep pt-2.5">
                    <p className="max-w-sm text-[10px] leading-4 text-muted">{roman ? "Chat mein likhi details submit nahin hotin. Contact form aur consent ke baad hi enquiry save hoti hai." : "Details typed in chat are not submitted. An enquiry is saved only through the contact form with consent."}</p>
                    <div className="flex gap-3">
                      <a href={telHref(site.admissionsPhone)} className="inline-flex items-center gap-1 text-[11px] font-bold text-ink hover:text-girls"><Phone size={13} /> {roman ? "Call" : "Call"}</a>
                      <WhatsAppChooserButton message={whatsappMessage} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#176b50]"><MessageCircle size={13} /> WhatsApp</WhatsAppChooserButton>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
