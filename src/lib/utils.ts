export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${query}`;
}

export function mapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function initials(name: string) {
  return name
    .replace(/^(Sir|Miss|Eng\.)\s+/i, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}
