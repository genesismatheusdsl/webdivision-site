"use client";

import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  PackageCheck,
  Sparkles,
} from "lucide-react";

type Product = {
  name: string;
  slug: string;
  tag: string;
  badge?: string;
  metric: string;
  price: string;
  shortDescription: string;
  points: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  icon: React.ReactNode;
};

const products: Product[] = [
  {
    name: "FlowDesk",
    slug: "flowdesk",
    tag: "CRM Comercial",
    badge: "Mais robusto",
    metric: "CRM mais completo do mercado",
    price: "A partir de R$ 69,90/mês",
    shortDescription:
      "CRM premium para empresas que precisam organizar leads, carteira, pipeline, orçamentos, vendas, comissões, campanhas, multiempresa e visão comercial real em um só lugar.",
    points: [
      "Pipeline visual, leads, carteira e vendas",
      "Orçamentos, propostas e acompanhamento comercial",
      "Gestão de equipe, metas e comissões",
      "Mais clareza sobre conversão e resultados",
      "Mais estrutura para crescer com controle",
    ],
    ctaLabel: "Acessar site",
    ctaHref: "https://flowdsk.com/",
    secondaryLabel: "Saiba mais",
    secondaryHref: "https://flowdsk.com/",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    name: "DecorFlow",
    slug: "decorflow",
    tag: "Sistema para locações",
    badge: "Catálogo + pedidos",
    metric: "Perfeito para locações e decoração",
    price: "A partir de R$ 99,90/mês",
    shortDescription:
      "Sistema premium para locadoras e empresas de decoração com catálogo online, pedidos, clientes, contratos, assinatura digital, financeiro e operação muito mais organizada.",
    points: [
      "Catálogo online com link público profissional",
      "Pedidos, contratos e atendimento centralizados",
      "Controle de clientes, eventos, kits e locações",
      "Mais organização para operação e entrega",
      "Mais visão para crescer com processo",
    ],
    ctaLabel: "Acessar site",
    ctaHref: "https://decorflow.com.br/",
    secondaryLabel: "Saiba mais",
    secondaryHref: "https://decorflow.com.br/",
    icon: <PackageCheck className="h-5 w-5" />,
  },
  {
    name: "AgendaFlow",
    slug: "agendaflow",
    tag: "Agenda premium",
    badge: "7 dias grátis",
    metric: "+ de 10.000 agendamentos por mês",
    price: "R$ 49,90/mês",
    shortDescription:
      "Sistema premium para barbearias, salões, estúdios e estética com agenda online, clientes, profissionais, serviços, bloqueios, cobrança e rotina muito mais organizada.",
    points: [
      "Agenda + clientes + faturamento",
      "Página de agendamento online",
      "Visual premium para mobile e desktop",
      "Serviços, profissionais e bloqueios organizados",
      "Feito para rotina real do negócio",
    ],
    ctaLabel: "Testar 7 dias grátis",
    ctaHref: "https://www.agendeflow.com/",
    secondaryLabel: "Saiba mais",
    secondaryHref: "https://www.agendeflow.com/",
    icon: <CalendarClock className="h-5 w-5" />,
  },
];

export default function Produtos() {
  return (
    <section
      id="produtos"
      className="relative overflow-hidden bg-[#f6f2e9] py-20 text-slate-900 md:py-28"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.11),transparent_26%)]" />
      <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[rgba(212,175,55,0.10)] blur-3xl" />

      <div className="container-site relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d8b85a] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c7414] shadow-sm">
            <Sparkles className="h-4 w-4" />
            Produtos principais
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-[#111111] md:text-5xl xl:text-6xl">
            Soluções premium para vender, organizar e escalar com mais força.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            A Web Division desenvolve sistemas pensados para operação real,
            crescimento profissional e apresentação de alto nível.
          </p>
        </div>

        <div className="mt-14 grid gap-8 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.slug}
              className="group relative flex h-full flex-col overflow-hidden rounded-[34px] border border-[#dbd2c0] bg-[#fffdfa] shadow-[0_20px_65px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_95px_rgba(0,0,0,0.16)]"
            >
              <div className="absolute inset-x-0 top-0 h-[108px] bg-[linear-gradient(135deg,#030303_0%,#0f0f0f_45%,#3b2d0d_100%)]" />
              <div className="absolute inset-x-0 top-0 h-[108px] bg-[radial-gradient(circle_at_top_right,rgba(255,214,102,0.38),transparent_32%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffe49b] to-transparent opacity-90" />
              <div className="absolute left-0 top-[74px] h-[40px] w-[74px] rounded-tr-[36px] bg-[#fffdfa]" />

              <div className="relative z-10 flex h-full flex-col p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2 pr-2">
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      {product.tag}
                    </span>

                    {product.badge && (
                      <span className="inline-flex items-center rounded-full border border-[#f2d477] bg-[#fff1bf] px-3 py-1 text-[11px] font-semibold text-[#7f5a00] shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e3c768] bg-[#fff3c8] text-[#8d690e]">
                    {product.icon}
                  </div>
                </div>

                <div className="mt-9">
                  <div className="inline-flex rounded-full border border-[#ecd68b] bg-[#fff5cf] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#9a7313] shadow-sm">
                    {product.metric}
                  </div>

                  <h3 className="mt-5 text-[1.95rem] font-black tracking-tight text-[#101010] md:text-[2.2rem]">
                    {product.name}
                  </h3>

                  <p className="mt-4 min-h-[128px] text-[14px] leading-8 text-slate-600 md:text-[15px]">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="mt-5 rounded-[24px] border border-[#eadfc8] bg-[linear-gradient(180deg,#fffefb_0%,#f8f1e4_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_24px_rgba(0,0,0,0.03)]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a3822a]">
                    Investimento
                  </div>

                  <div className="mt-3 text-[1.55rem] font-black leading-[1.14] tracking-tight text-[#101010] md:text-[1.95rem]">
                    {product.price}
                  </div>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {product.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ddb74a] bg-[linear-gradient(180deg,#fff3c4_0%,#f2d77e_100%)] text-[#8a6510]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>

                      <span className="text-[14px] leading-7 text-slate-700 md:text-[15px]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={product.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[#d8b85a] bg-white px-5 py-3 text-sm font-semibold text-[#8a6510] shadow-[0_10px_22px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#c79d2e] hover:bg-[#fff8e7] hover:text-[#6f510b] hover:shadow-[0_16px_30px_rgba(156,116,20,0.16)]"
                >
                  {product.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </a>

                  <a
                    href={product.secondaryHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[#dccca8] bg-white px-5 py-3 text-sm font-semibold text-[#181818] shadow-[0_10px_22px_rgba(0,0,0,0.05)] transition duration-300 hover:border-[#d8b85a] hover:bg-[#fffaf0]"
                  >
                    {product.secondaryLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}