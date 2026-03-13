"use client";

import {
  ArrowUpRight,
  BarChart3,
  Globe,
  Layers3,
  Sparkles,
  Workflow,
} from "lucide-react";

const aboutItems = [
  {
    number: "01",
    title: "Sites profissionais",
    text: "Criação de sites institucionais, páginas de conversão e presença digital premium para empresas que querem transmitir mais autoridade e fechar mais oportunidades.",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    number: "02",
    title: "Lojas virtuais",
    text: "Estruturas de venda online com foco em experiência, organização, confiança visual e performance comercial para negócios que querem vender melhor.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    number: "03",
    title: "Automações e dashboards",
    text: "Integrações, fluxos inteligentes e painéis estratégicos para reduzir falhas operacionais, ganhar tempo e enxergar o negócio com mais clareza.",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    number: "04",
    title: "Sistemas sob medida",
    text: "Quando a operação exige algo mais forte, desenvolvemos plataformas específicas para a rotina real da empresa, com visão prática e escalável.",
    icon: <Workflow className="h-5 w-5" />,
  },
];

export default function Sobre() {
  return (
    <section
      id="sobre"
      className="relative overflow-hidden bg-white py-24 md:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.06),transparent_22%),linear-gradient(180deg,#ffffff_0%,#f8fbfc_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
      <div className="absolute left-[10%] top-[18%] h-[220px] w-[220px] rounded-full bg-cyan-100/60 blur-[90px]" />
      <div className="absolute right-[10%] bottom-[10%] h-[240px] w-[240px] rounded-full bg-emerald-100/60 blur-[100px]" />

      <div className="container-site relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              <Sparkles className="h-4 w-4" />
              Quem Somos
            </span>

            <h2 className="mt-5 text-[2rem] font-black leading-[1.06] tracking-[-0.03em] text-slate-950 sm:text-[2.4rem] lg:text-[3rem]">
              A Web Division é uma empresa de tecnologia especializada em
              <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                {" "}
                sistemas proprietários e soluções digitais inteligentes.
              </span>
            </h2>

            <p className="mt-6 max-w-[640px] text-[15px] leading-8 text-slate-600 md:text-[16px]">
              Mais do que criar algo bonito, nossa proposta é desenvolver
              estruturas digitais que ajudem empresas a operar melhor, vender com
              mais consistência e crescer com mais clareza.
            </p>

            <p className="mt-4 max-w-[640px] text-[15px] leading-8 text-slate-600 md:text-[16px]">
              Atuamos na criação de produtos próprios, sistemas sob medida,
              páginas de alto impacto, automações, dashboards e experiências
              premium para negócios que querem elevar seu nível de posicionamento
              e organização.
            </p>

            <p className="mt-4 max-w-[640px] text-[15px] leading-8 text-slate-500 md:text-[16px]">
              Nosso foco é unir tecnologia, estratégia e visão de negócio para
              entregar soluções que não apenas impressionam visualmente, mas que
              também sustentam crescimento real.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                Tecnologia com direção estratégica
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                Soluções pensadas para negócio real
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Posicionamento
                  </div>
                  <div className="mt-1 text-base font-bold text-slate-950">
                    Tecnologia com visão de negócio
                  </div>
                </div>

                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm leading-7 text-slate-600 md:text-[15px]">
                  Nossa diferença está em pensar além do layout. Cada projeto é
                  construído para fortalecer operação, percepção de valor, fluxo
                  comercial e estrutura digital da empresa.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {aboutItems.map((item) => (
              <div
                key={item.number}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-cyan-200 hover:shadow-[0_20px_44px_rgba(15,23,42,0.08)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 text-cyan-700 transition duration-300 group-hover:scale-110 group-hover:shadow-md">
                      {item.icon}
                    </div>

                    <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-slate-500">
                      {item.number}
                    </div>
                  </div>

                  <div className="mt-5 text-[1.05rem] font-bold text-slate-950">
                    {item.title}
                  </div>

                  <div className="mt-3 text-sm leading-7 text-slate-600 md:text-[15px]">
                    {item.text}
                  </div>
                </div>
              </div>
            ))}

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] sm:col-span-2">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  <Layers3 className="h-4 w-4" />
                  Web Division
                </div>

                <h3 className="mt-4 text-2xl font-black tracking-tight text-white">
                  Construímos presença, estrutura e tecnologia para marcas que
                  querem parecer mais fortes e operar em outro nível.
                </h3>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-[15px]">
                  Nosso objetivo é criar soluções que unam design, inteligência,
                  operação e crescimento em uma base sólida, moderna e premium.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
