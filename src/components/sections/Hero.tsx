"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Sparkles, Target, Workflow } from "lucide-react";

const flowItems = [
  {
    letter: "F",
    title: "Fundamentos estratégicos",
    text: "Organização da base do negócio, clareza de posicionamento e estrutura comercial para crescimento sólido.",
    icon: <Target className="h-4 w-4" />,
    color:
      "from-cyan-500 via-sky-500 to-blue-500 text-cyan-700 border-cyan-200 bg-cyan-50",
  },
  {
    letter: "L",
    title: "Leads qualificados",
    text: "Captação estruturada e geração de oportunidades reais de fechamento.",
    icon: <BarChart3 className="h-4 w-4" />,
    color:
      "from-emerald-500 via-teal-500 to-cyan-500 text-emerald-700 border-emerald-200 bg-emerald-50",
  },
  {
    letter: "O",
    title: "Otimização contínua",
    text: "Processos, funis e presença digital evoluindo continuamente.",
    icon: <Workflow className="h-4 w-4" />,
    color:
      "from-violet-500 via-fuchsia-500 to-pink-500 text-violet-700 border-violet-200 bg-violet-50",
  },
  {
    letter: "W",
    title: "Winning Sales",
    text: "Estrutura + posicionamento + operação transformados em vendas.",
    icon: <Sparkles className="h-4 w-4" />,
    color:
      "from-amber-500 via-orange-500 to-rose-500 text-orange-700 border-orange-200 bg-orange-50",
  },
];

function useTypingLines(lines: string[], speed = 28, hold = 1200) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayed, setDisplayed] = useState(lines.map(() => ""));
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = lines[activeIndex];
    const currentDisplayed = displayed[activeIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentDisplayed.length < currentText.length) {
          setDisplayed((prev) => {
            const next = [...prev];
            next[activeIndex] = currentText.slice(
              0,
              currentDisplayed.length + 1
            );
            return next;
          });
        } else {
          setTimeout(() => setIsDeleting(true), hold);
        }
      } else {
        if (currentDisplayed.length > 0) {
          setDisplayed((prev) => {
            const next = [...prev];
            next[activeIndex] = currentText.slice(
              0,
              currentDisplayed.length - 1
            );
            return next;
          });
        } else {
          setIsDeleting(false);
          setActiveIndex((prev) => (prev + 1) % lines.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [activeIndex, displayed, isDeleting, lines, speed, hold]);

  return { displayed, activeIndex };
}

export default function FlowMethodCard() {
  const texts = useMemo(() => flowItems.map((item) => item.text), []);
  const { displayed, activeIndex } = useTypingLines(texts, 22, 1500);

  return (
    <section className="relative bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:gap-14">
          <div className="relative lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
              <Sparkles className="h-3.5 w-3.5" />
              Método FLOW
            </div>

            <h2 className="mt-5 max-w-[520px] text-[2rem] font-black leading-[1.06] tracking-[-0.03em] text-slate-950 sm:text-[2.25rem] lg:text-[2.7rem]">
              Crescimento não vem de tentativa.
              <span className="block bg-gradient-to-r from-cyan-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                Vem de estrutura.
              </span>
            </h2>

            <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-slate-600 sm:text-base">
              O FLOW organiza posicionamento, captação e operação comercial em
              uma estrutura mais clara, mais forte e mais preparada para gerar
              resultado.
            </p>

            <div className="mt-7 h-px w-full max-w-[420px] bg-gradient-to-r from-cyan-200 via-slate-200 to-transparent" />

            <div className="mt-7 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                Mais clareza de posicionamento
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                Mais eficiência comercial
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                Mais consistência para vender
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-6">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-50/70 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.07),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05),transparent_25%)]" />

            <div className="relative z-10 rounded-[26px] border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Método proprietário
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 text-cyan-700 shadow-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="mt-1 flex items-center gap-1 text-[2rem] font-black leading-none tracking-tight">
                        {flowItems.map((item, index) => {
                          const isActive = activeIndex === index;

                          const gradientClasses = item.color
                            .split(" ")
                            .filter(
                              (cls) =>
                                cls.startsWith("from-") ||
                                cls.startsWith("via-") ||
                                cls.startsWith("to-")
                            )
                            .join(" ");

                          return (
                            <span
                              key={item.letter}
                              className={[
                                "inline-block transition-all duration-500",
                                isActive
                                  ? `scale-110 bg-gradient-to-r bg-clip-text text-transparent ${gradientClasses}`
                                  : "text-slate-900/85",
                              ].join(" ")}
                              style={{
                                animation: isActive
                                  ? "flowPulse 1.2s ease-in-out infinite"
                                  : "none",
                              }}
                            >
                              {item.letter}
                            </span>
                          );
                        })}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        Framework de crescimento digital
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  Estrutura comercial
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-5 grid gap-3">
              {flowItems.map((item, index) => {
                const isActive = activeIndex === index;

                return (
                  <div
                    key={item.letter}
                    className={[
                      "group relative overflow-hidden rounded-[24px] border bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition duration-500",
                      isActive
                        ? "border-cyan-300 shadow-[0_18px_35px_rgba(34,211,238,0.12)] -translate-y-[2px]"
                        : "border-slate-200 hover:border-cyan-200 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "absolute inset-0 opacity-0 transition duration-500",
                        isActive ? "opacity-100" : "group-hover:opacity-100",
                        "bg-gradient-to-r from-cyan-50 via-white to-emerald-50",
                      ].join(" ")}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        className={[
                          "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-base font-black transition-all duration-500",
                          item.color,
                          isActive ? "scale-110 shadow-md" : "",
                        ].join(" ")}
                        style={{
                          animation: isActive
                            ? "flowPulse 1.2s ease-in-out infinite"
                            : "none",
                        }}
                      >
                        {item.letter}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={[
                              "inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-slate-50 transition-all duration-500",
                              isActive
                                ? "border-cyan-200 text-cyan-700"
                                : "border-slate-200 text-slate-500",
                            ].join(" ")}
                          >
                            {item.icon}
                          </span>

                          <div className="text-[1rem] font-bold text-slate-950 md:text-[1.05rem]">
                            {item.title}
                          </div>

                          <span
                            className={[
                              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-500",
                              isActive
                                ? "border border-cyan-200 bg-cyan-50 text-cyan-700"
                                : "border border-slate-200 bg-slate-50 text-slate-500",
                            ].join(" ")}
                          >
                            Etapa {index + 1}
                          </span>
                        </div>

                        <div className="mt-3 min-h-[56px] text-sm leading-7 text-slate-600 md:text-[15px]">
                          {displayed[index]}
                          {isActive && (
                            <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[3px] animate-pulse bg-cyan-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <style jsx>{`
              @keyframes flowPulse {
                0%,
                100% {
                  transform: scale(1);
                  filter: brightness(1);
                }
                50% {
                  transform: scale(1.08);
                  filter: brightness(1.15);
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
}