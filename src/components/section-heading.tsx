import { AnimatedUnderline, MotionReveal } from "@/components/motion-system";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
  number?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", inverse = false, number }: SectionHeadingProps) {
  return (
    <MotionReveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div className={cn("flex items-center gap-4", align === "center" && "justify-center")}>
        {number ? <span className="section-number">{number}</span> : null}
        <p className={cn("eyebrow", inverse && "text-gold-light")}>{eyebrow}</p>
      </div>
      <h2 className={cn("section-title mt-4", inverse && "text-white")}>{title}</h2>
      <AnimatedUnderline className={cn("mt-5 w-24", align === "center" && "mx-auto")} />
      {description ? <p className={cn("body-lead mt-5 max-w-2xl", align === "center" && "mx-auto", inverse && "text-white/64")}>{description}</p> : null}
    </MotionReveal>
  );
}
