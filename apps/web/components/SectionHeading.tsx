export function SectionHeading({ id, eyebrow, title, description }: { id: string; eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ctp-mauve">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-semibold leading-tight tracking-tight text-balance text-ctp-text sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 leading-7 text-ctp-subtext1">{description}</p> : null}
    </div>
  );
}
