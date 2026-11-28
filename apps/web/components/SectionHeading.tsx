export function SectionHeading({ id, eyebrow, title, description, as: Heading = "h2" }: { id: string; eyebrow?: string; title: string; description?: string; as?: "h1" | "h2" }) {
  return (
    <div className="max-w-2xl pr-16">
      {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ctp-mauve">{eyebrow}</p>}
      <Heading id={id} className={`${Heading === "h1" ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"} font-semibold leading-tight tracking-tight text-balance wrap-break-word text-ctp-text`}>{title}</Heading>
      {description ? <p className={Heading === "h1" ? "mt-2 max-w-prose text-sm leading-relaxed text-ctp-subtext0" : "mt-2 leading-7 text-ctp-subtext1"}>{description}</p> : null}
    </div>
  );
}
