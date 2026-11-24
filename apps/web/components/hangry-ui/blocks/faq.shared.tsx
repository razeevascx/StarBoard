import { memo, useId, type ComponentProps, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "cn";
import { Card } from "@/components/hangry-ui/components/card";

export interface FaqItem {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface FaqProps extends Omit<ComponentProps<"section">, "title"> {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: readonly FaqItem[];
  multiple?: boolean;
  defaultOpenId?: string;
}

const defaultItems: readonly FaqItem[] = [
  {
    id: "start",
    question: "How do I get started?",
    answer:
      "Choose a component, follow its installation steps, and add it to your page. Start small and make it your own.",
  },
  {
    id: "customize",
    question: "Can I customize the design?",
    answer:
      "Yes. Update the content, adjust the Tailwind classes, and use your own theme tokens. The source lives in your project.",
  },
  {
    id: "mobile",
    question: "Does it work on smaller screens?",
    answer:
      "The layout adapts to the space available. Questions wrap naturally, and answers remain readable on phones and tablets.",
  },
  {
    id: "content",
    question: "Can answers include more than text?",
    answer:
      "Absolutely. Pass React content to include links, lists, images, or other components in an answer.",
  },
];

const FaqEntry = memo(function FaqEntry({
  item,
  name,
  defaultOpen,
  card,
}: {
  item: FaqItem;
  name?: string;
  defaultOpen: boolean;
  card: boolean;
}) {
  const content = (
    <details name={name} open={defaultOpen || undefined} className="group/faq">
      <summary className="cursor-pointer list-none px-5 py-5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <h3 className={cn("typography-subsection-title", "flex items-start justify-between gap-5")}>
          <span className="transition-colors group-hover/faq:text-ctp-mauve">{item.question}</span>
          <Plus
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-ctp-subtext0 motion-safe:transition-transform group-open/faq:rotate-45 group-open/faq:text-ctp-mauve"
          />
        </h3>
      </summary>
      <div className={cn("px-5 pb-5 text-sm leading-6", "typography-body")}>{item.answer}</div>
    </details>
  );

  return card ? (
    <Card title="" description="" className="w-full! max-w-none! p-0! shadow-none!">
      {content}
    </Card>
  ) : (
    content
  );
});

export const FaqLayout = memo(function FaqLayout({
  eyebrow,
  title = "A few things you might be wondering.",
  description = "The details, without the guesswork.",
  items = defaultItems,
  layout = "list",
  multiple = false,
  defaultOpenId,
  className,
  ...props
}: FaqProps & { layout?: "list" | "cards" | "split" } = {}) {
  const id = useId();
  const split = layout === "split";

  return (
    <section
      data-slot="faq"
      data-layout={layout}
      {...props}
      aria-labelledby={props["aria-labelledby"] ?? `${id}-title`}
      className={cn("@container w-full text-foreground", className)}
    >
      <div className={split ? "grid items-start gap-8 @3xl:grid-cols-[2fr_3fr]" : "space-y-8"}>
        <header className={split ? "space-y-3" : "max-w-2xl space-y-3"}>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ctp-mauve">{eyebrow}</p>
          )}
          <h2
            id={`${id}-title`}
            className="text-3xl font-semibold leading-tight tracking-tight text-balance text-ctp-text sm:text-4xl"
          >
            {title}
          </h2>
          {description && <p className={cn("leading-7 text-ctp-subtext1")}>{description}</p>}
        </header>
        <div
          className={
            layout === "cards"
              ? "grid gap-3"
              : "divide-y divide-ctp-surface1/60 border-y border-ctp-surface1/60"
          }
        >
          {items.map((item) => (
            <FaqEntry
              key={item.id}
              item={item}
              name={multiple ? undefined : `${id}-questions`}
              defaultOpen={item.id === defaultOpenId}
              card={layout === "cards"}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
