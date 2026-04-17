"use client";

import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

const ctaItems = [
  "FlowDesk",
  "AgendaFlow",
  "DecorFlow",
  "Sites profissionais",
  "Sistemas sob medida",
  "Automações",
  "Dashboards",
  "Lojas virtuais",
  "Landing pages",
  "Estrutura digital",
];

export default function CTA() {
  const marqueeItems = [...ctaItems, ...ctaItems];

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-white py-24 md:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.06),transparent_22%),linear-gradient(180deg,#ffffff_0%,#f8fbfc_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />

      <div className="container-site relative z-10">
        <div className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="relative border-b border-slate-200 bg-slate-50/80 py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white via-white/90 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white via-white/90 to-transparent" />

            <div className="flex min-w-max animate-[ctaMarquee_24s_linear_infinite] items-center gap-3 whitespace-nowrap">
              {marqueeItems.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-3"
                >
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {item}
                  </span>
                  <span className="text-slate-300">•</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative px-6 py-12 text-center md:px-10 md:py-16">
            <div className="absolute left-[8%] top-[18%] h-[180px] w-[180px] rounded-full bg-cyan-100/70 blur-[90px]" />
            <div className="absolute right-[10%] bottom-[14%] h-[180px] w-[180px] rounded-full bg-emerald-100/70 blur-[90px]" />

            <div className="relative z-10 mx-auto max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                <Sparkles className="h-4 w-4" />
                Próximo passo
              </span>

              <h2 className="mt-5 text-[2rem] font-black leading-[1.06] tracking-[-0.03em] text-slate-950 sm:text-[2.5rem] lg:text-[3.2rem]">
                Vamos criar uma estrutura digital
                <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  {" "}
                  mais forte para o seu negócio.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-8 text-slate-600 md:text-[17px]">
                Fale com a Web Division para solicitar orçamento, entender qual
                solução faz mais sentido para sua empresa e iniciar um projeto
                com mais clareza, estratégia e nível profissional.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-900"
                >
                  Solicitar orçamento
                  <ArrowRight className="h-4 w-4" />
                </a>

<a href="#" className="btn-secondary-light">
  Falar no WhatsApp
</a>



              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
                <span>Projetos sob medida</span>
                <span className="text-slate-300">•</span>
                <span>Produtos próprios</span>
                <span className="text-slate-300">•</span>
                <span>Mais estrutura para crescer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ctaMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
