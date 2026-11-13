"use client";

import { useState } from "react";
import { primaryBtn } from "./ui";

export type ShownQuestion = { question: string; options: readonly string[] };

/** One question at a time; every question needs an answer. Correctness is checked on the server. */
export function Questions({
  questions,
  intro,
  counter,
  nextLabel,
  finalLabel,
  pending,
  onSubmit,
}: {
  questions: readonly ShownQuestion[];
  intro: string;
  counter: (i: number, n: number) => string;
  nextLabel: string;
  finalLabel: string;
  pending?: boolean;
  onSubmit: (answers: number[]) => void;
}): React.JSX.Element {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [index, setIndex] = useState(0);
  const q = questions[index]!;
  const last = index === questions.length - 1;
  return (
    <section className="flex flex-col gap-4" data-bu-question={index + 1}>
      <p className="text-base font-semibold text-muted-foreground">{intro}</p>
      {questions.length > 1 && (
        <p className="text-sm font-bold text-muted-foreground">
          {counter(index + 1, questions.length)}
        </p>
      )}
      <h2 className="text-xl leading-snug break-words text-foreground">
        {q.question}
      </h2>
      <div
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-label={q.question}
      >
        {q.options.map((option, oi) => (
          <button
            key={`${index}-${oi}`}
            type="button"
            role="radio"
            aria-checked={answers[index] === oi}
            onClick={() =>
              setAnswers((prev) => prev.map((a, i) => (i === index ? oi : a)))
            }
            className={`min-h-14 rounded-2xl border-2 px-4 py-2 text-left text-base font-semibold break-words ${answers[index] === oi ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-foreground"}`}
            data-bu-option={oi}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={primaryBtn}
        disabled={answers[index] === null || pending === true}
        onClick={() =>
          last ? onSubmit(answers.map((a) => a ?? -1)) : setIndex(index + 1)
        }
        data-bu-next
      >
        {last ? finalLabel : nextLabel}
      </button>
    </section>
  );
}
