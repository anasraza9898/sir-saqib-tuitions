import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
};

export function SectionHeading({ eyebrow, title, description, align = "left", inverse = false }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className={cn("section-eyebrow", inverse && "text-gold-300")}>{eyebrow}</p>
      <h2 className={cn("section-title", inverse && "text-white")}>{title}</h2>
      {description ? <p className={cn("mt-4 text-base leading-7 text-navy-600", inverse && "text-cream-100/80")}>{description}</p> : null}
    </div>
  );
}
