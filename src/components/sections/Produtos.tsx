"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Crown,
  LayoutDashboard,
  MessageCircle,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Plus,
  Minus,
  Rocket,
  Target,
  Layers3,
} from "lucide-react";

type PlanKey = "free" | "starter" | "growth" | "scale" | "pro";

type FlowDeskPlan = {
  key: PlanKey;
  title: string;
  subtitle: string;
  price: number;
  usersIncluded: number;
  idealFor: string;
  features: string[];
  recommended?: boolean;
};

type Product = {
  name: string;
  slug: string;
  tag: string;
  badge?: string;
  price: string;
  shortDescription: string;
  longDescription: string;
  idealFor: string;
  highlights: string[];
  modules: string[];
  benefits: string[];
  points: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  accent: string;
  icon: React.ReactNode;
};

const EXTRA_USER_PRICE = 29.9;
const WHATSAPP_ADDON_PRICE = 149.9;
const CAMPAIGNS_ADDON_PRICE = 49.9;

const FLOWDESK_PLANS: FlowDeskPlan[] = [
  {
    key: "free",
    title: "Free",
    subtitle: "Para começar",
    price: 0,
    usersIncluded: 1,
    idealFor: "Conhecer o sistema e iniciar a organização comercial.",
    features: [
      "CRM básico",
      "Pipeline simples",
      "Dashboard inicial",
      "Gestão inicial de leads",
    ],
  },
  {
    key: "starter",
    title: "Starter",
    subtitle: "Para estruturar a operação",
    price: 69.9,
    usersIncluded: 1,
    idealFor: "Pequenos negócios que querem vender com mais organização.",
    features: [
      "CRM completo",
      "Pipeline avançado",
      "Orçamentos ilimitados",
      "Exportação em PDF",
    ],
  },
  {
    key: "growth",
    title: "Growth",
    subtitle: "Para crescer com controle",
    price: 149.9,
    usersIncluded: 3,
    idealFor:
      "Empresas com operação comercial ativa e necessidade de acompanhar resultados.",
    features: [
      "Gestão de equipe",
      "Controle de leads",
      "Métricas de vendas",
      "Comissões",
    ],
  },
  {
    key: "scale",
    title: "Scale",
    subtitle: "Para operação mais forte",
    price: 239.9,
    usersIncluded: 5,
    idealFor:
      "Equipes maiores que precisam de visão gerencial e produtividade.",
    features: [
      "Equipe completa",
      "Ranking de vendedores",
      "Dashboard avançado",
      "Suporte prioritário",
    ],
  },
  {
    key: "pro",
    title: "Pro",
    subtitle: "Para gestão avançada",
    price: 449.9,
    usersIncluded: 10,
    idealFor:
      "Operações premium que querem inteligência, profundidade e escala.",
    features: [
      "Alertas estratégicos",
      "Analytics avançado",
      "Recursos premium de gestão",
      "FlowDesk Academy",
    ],
    recommended: true,
  },
];

const products: Product[] = [
  {
    name: "FlowDesk",
    slug: "flowdesk",
    tag: "CRM Comercial",
    badge: "Mais robusto",
    price: "A partir de R$ 69,90/mês",
    shortDescription:
      "CRM para pequenas e médias empresas com leads, carteira, pipeline, orçamentos, vendas, comissões, campanhas, multiempresa e visão comercial estratégica.",
    longDescription:
      "O FlowDesk foi criado para estruturar e profissionalizar a operação comercial. Ele centraliza atendimento, funil, clientes, vendas, equipe, comissões, campanhas, assinatura por planos e inteligência em um único ambiente. É ideal para empresas que querem sair do improviso e operar com mais controle, produtividade e crescimento.",
    idealFor:
      "Pequenas e médias empresas, operações comerciais, times de vendas, gestores e negócios que precisam escalar com mais organização.",
    highlights: [
      "Planos Free, Starter, Growth, Scale e Pro",
      "Simulador de assinatura com usuários e módulos extras",
      "Atendimento / WhatsApp como módulo opcional",
      "Campanhas e origem de leads",
      "Multiempresa e visão gerencial",
      "FlowIA e inteligência comercial",
    ],
    modules: [
      "Dashboard comercial e financeiro",
      "Leads, carteira e pipeline",
      "Orçamentos, vendas e comissões",
      "Equipe, papéis e permissões",
      "Campanhas e marketing",
      "Assinatura e simulador",
      "Multiempresa",
      "FlowIA",
    ],
    benefits: [
      "Mais controle da operação",
      "Mais clareza sobre conversão e resultados",
      "Mais produtividade para equipe",
      "Mais estrutura para escalar",
    ],
    points: [
      "CRM completo com funil visual",
      "Gestão de equipe e comissões",
      "Planos flexíveis para cada fase do negócio",
    ],
    ctaLabel: "Solicitar orçamento",
    ctaHref: "#cta",
    secondaryLabel: "Ver método",
    secondaryHref: "#metodo-flow",
    accent: "from-cyan-500/10 via-sky-500/5 to-transparent",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    name: "ImobFlow",
    slug: "imobflow",
    tag: "ERP Imobiliário",
    badge: "Operação especializada",
    price: "A partir de R$ 380/mês",
    shortDescription:
      "ERP focado em imobiliárias, com contratos, imóveis, fluxo de caixa, inadimplência, relatórios exportáveis e dashboards estratégicos.",
    longDescription:
      "O ImobFlow organiza a operação da imobiliária de ponta a ponta. Ele foi pensado para negócios que precisam controlar contratos, imóveis, inadimplência, financeiro e visão gerencial com mais segurança e menos retrabalho.",
    idealFor:
      "Imobiliárias e operações que precisam unir controle financeiro, carteira, contratos e acompanhamento gerencial em um sistema mais estruturado.",
    highlights: [
      "Foco em operação imobiliária real",
      "Controle financeiro e inadimplência",
      "Dashboards e relatórios exportáveis",
      "Mais segurança para decisões",
    ],
    modules: [
      "Gestão de contratos",
      "Gestão de imóveis",
      "Fluxo de caixa",
      "Inadimplência",
      "Relatórios e dashboards",
    ],
    benefits: [
      "Mais previsibilidade financeira",
      "Mais controle operacional",
      "Menos desorganização nos contratos",
      "Mais segurança para gestão",
    ],
    points: [
      "Controle financeiro e operacional",
      "Inadimplência e fluxo de caixa",
      "Gestão integrada para imobiliárias",
    ],
    ctaLabel: "Solicitar orçamento",
    ctaHref: "#cta",
    secondaryLabel: "Ver método",
    secondaryHref: "#metodo-flow",
    accent: "from-violet-500/10 via-fuchsia-500/5 to-transparent",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    name: "AgendaFlow",
    slug: "agendaflow",
    tag: "Agenda premium",
    badge: "7 dias grátis",
    price: "R$ 49,90/mês",
    shortDescription:
      "Sistema premium para barbearias, salões, estúdios e estética com agenda, clientes, serviços, profissionais, bloqueios e cobrança mais organizada.",
    longDescription:
      "O AgendaFlow transforma a agenda do estabelecimento em uma operação mais profissional. Ele organiza agendamentos, equipe, horários, serviços, clientes e pagamentos em uma experiência moderna, rápida e adaptada ao celular. É uma solução pensada para reduzir bagunça no WhatsApp, evitar falhas na agenda e elevar a percepção do negócio.",
    idealFor:
      "Barbearias, salões, estúdios, estética e negócios de atendimento que querem organizar agendamentos com visual premium e experiência profissional.",
    highlights: [
      "7 dias grátis para testar sem compromisso",
      "Página pública de agendamento",
      "Pix integrado para sinal ou pagamento antecipado",
      "Experiência premium no mobile e desktop",
    ],
    modules: [
      "Agenda online 24h",
      "Gestão de clientes e profissionais",
      "Serviços, categorias e horários",
      "Bloqueios e organização da agenda",
      "Página pública de reserva",
      "Painel administrativo premium",
    ],
    benefits: [
      "Menos bagunça no WhatsApp",
      "Mais organização no dia a dia",
      "Mais profissionalismo no atendimento",
      "Mais controle sobre a operação",
    ],
    points: [
      "Agenda + clientes + faturamento",
      "Visual premium para mobile e desktop",
      "Feito para rotina real do negócio",
    ],
    ctaLabel: "Testar 7 dias grátis",
    ctaHref: "https://www.agendeflow.com",
    secondaryLabel: "Ver demonstração",
    secondaryHref: "https://www.agendeflow.com",
    accent: "from-emerald-500/10 via-teal-500/5 to-transparent",
    icon: <CalendarClock className="h-5 w-5" />,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Produtos() {
  const [openProduct, setOpenProduct] = useState<string | null>("flowdesk");

  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("starter");
  const [desiredUsers, setDesiredUsers] = useState(1);
  const [includeWhatsapp, setIncludeWhatsapp] = useState(false);
  const [includeCampaigns, setIncludeCampaigns] = useState(false);

  const activeProduct =
    products.find((item) => item.slug === openProduct) || null;

  const activeFlowDeskPlan = useMemo(() => {
    return (
      FLOWDESK_PLANS.find((item) => item.key === selectedPlan) ||
      FLOWDESK_PLANS[1]
    );
  }, [selectedPlan]);

  const minimumUsers = activeFlowDeskPlan.usersIncluded;
  const normalizedUsers = Math.max(desiredUsers, minimumUsers);
  const extraUsers = Math.max(0, normalizedUsers - minimumUsers);
  const extraUsersTotal = extraUsers * EXTRA_USER_PRICE;
  const addonsTotal =
    (includeWhatsapp ? WHATSAPP_ADDON_PRICE : 0) +
    (includeCampaigns ? CAMPAIGNS_ADDON_PRICE : 0);
  const estimatedTotal =
    activeFlowDeskPlan.price + extraUsersTotal + addonsTotal;

  function toggleProduct(slug: string) {
    setOpenProduct((prev) => (prev === slug ? null : slug));
  }

  function selectPlan(planKey: PlanKey) {
    const plan = FLOWDESK_PLANS.find((item) => item.key === planKey);
    if (!plan) return;

    setSelectedPlan(planKey);
    setDesiredUsers((prev) => Math.max(prev, plan.usersIncluded));
  }

  function buildWhatsappLink() {
    const texto = `Olá! Quero contratar o plano ${activeFlowDeskPlan.title} do FlowDesk.

Plano: ${activeFlowDeskPlan.title}
Valor base: ${formatCurrency(activeFlowDeskPlan.price)}
Usuários desejados: ${normalizedUsers}
Usuários extras: ${extraUsers}
Atendimento / WhatsApp: ${includeWhatsapp ? "Sim" : "Não"}
Campanhas: ${includeCampaigns ? "Sim" : "Não"}
Valor estimado: ${formatCurrency(estimatedTotal)}

Gostaria de entender a melhor configuração para minha operação.`;

    return `https://wa.me/5562994693465?text=${encodeURIComponent(texto)}`;
  }

  return (
    <section
      id="produtos"
      className="relative overflow-hidden bg-white py-24 text-slate-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_22%),linear-gradient(180deg,#ffffff_0%,#f8fbfc_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />

      <div className="container-site relative z-10">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            <Sparkles className="h-4 w-4" />
            Produtos principais
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Um ecossistema digital para vender, organizar e escalar.
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            A Web Division não trabalha só com presença digital. Trabalha com
            estrutura. Nossos produtos atacam operação comercial, gestão
            imobiliária e agendamento premium com visão moderna de negócio.
          </p>
        </div>

        <div className="mt-14 grid gap-7 xl:grid-cols-3">
          {products.map((product) => {
            const isOpen = openProduct === product.slug;

            return (
              <article
                key={product.slug}
                className={[
                  "group relative overflow-hidden rounded-[30px] border p-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition duration-300",
                  isOpen
                    ? "border-cyan-200 bg-white"
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:border-cyan-200",
                ].join(" ")}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${product.accent} opacity-100`}
                />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {product.tag}
                      </span>

                      {product.badge && (
                        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                          {product.badge}
                        </div>
                      )}
                    </div>

                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-cyan-700">
                      {product.icon}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-3xl font-black tracking-tight text-slate-950">
                      {product.name}
                    </h3>

                    <p className="mt-4 min-h-[96px] text-sm leading-relaxed text-slate-600">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Investimento
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-950">
                      {product.price}
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {product.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm leading-relaxed text-slate-700">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href={product.ctaHref}
                      target={
                        product.ctaHref.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        product.ctaHref.startsWith("http")
                          ? "noreferrer"
                          : undefined
                      }
                      className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                    >
                      {product.ctaLabel}
                    </a>

                    <button
                      type="button"
                      onClick={() => toggleProduct(product.slug)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {isOpen ? "Ocultar detalhes" : "Saiba mais"}
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {activeProduct && (
          <div className="mt-10 overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5 md:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    {activeProduct.icon}
                    {activeProduct.name}
                  </div>

                  <h3 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                    Saiba mais sobre o {activeProduct.name}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                    {activeProduct.longDescription}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                  <MiniStat
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Mais controle"
                    value="Operação centralizada"
                    tone="cyan"
                  />
                  <MiniStat
                    icon={<Rocket className="h-4 w-4" />}
                    title="Mais crescimento"
                    value="Estrutura para escalar"
                    tone="violet"
                  />
                  <MiniStat
                    icon={<Target className="h-4 w-4" />}
                    title="Mais performance"
                    value="Fluxo mais eficiente"
                    tone="emerald"
                  />
                  <MiniStat
                    icon={<Layers3 className="h-4 w-4" />}
                    title="Mais organização"
                    value="Visão clara do negócio"
                    tone="amber"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid gap-5 xl:grid-cols-3">
                <DetailBlock
                  icon={<Users className="h-4 w-4" />}
                  title="Ideal para"
                  items={[activeProduct.idealFor]}
                />

                <DetailBlock
                  icon={<Crown className="h-4 w-4" />}
                  title="Destaques"
                  items={activeProduct.highlights}
                />

                <DetailBlock
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  title="Módulos / recursos"
                  items={activeProduct.modules}
                />
              </div>

              <div className="mt-5">
                <DetailBlock
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Benefícios"
                  items={activeProduct.benefits}
                />
              </div>

              {activeProduct.slug === "flowdesk" && (
                <div className="mt-8 space-y-8">
                  <div className="rounded-[28px] border border-fuchsia-200 bg-fuchsia-50/60 p-6">
                    <div className="mb-4 text-lg font-bold text-slate-950">
                      O que torna o FlowDesk mais forte
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <MiniInfo
                        icon={<BarChart3 className="h-4 w-4" />}
                        label="Gestão comercial completa"
                        text="Leads, carteira, pipeline, orçamentos, vendas, comissões e dashboards em um só lugar."
                      />
                      <MiniInfo
                        icon={<Users className="h-4 w-4" />}
                        label="Planos por fase da empresa"
                        text="Free, Starter, Growth, Scale e Pro, com evolução conforme a operação cresce."
                      />
                      <MiniInfo
                        icon={<MessageCircle className="h-4 w-4" />}
                        label="Atendimento / WhatsApp"
                        text="Módulo opcional para centralizar atendimento e operação comercial integrada."
                      />
                      <MiniInfo
                        icon={<Megaphone className="h-4 w-4" />}
                        label="Campanhas e origem de leads"
                        text="Acompanhe marketing, origem dos contatos e performance comercial com mais clareza."
                      />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-slate-50/50 p-6">
                    <div className="mb-6 max-w-3xl">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                        <Sparkles className="h-4 w-4" />
                        Simulador do FlowDesk
                      </div>

                      <h4 className="text-2xl font-bold text-slate-950">
                        Monte o plano ideal para sua operação
                      </h4>

                      <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
                        Escolha o plano base, defina a quantidade de usuários e
                        adicione módulos opcionais conforme sua necessidade.
                      </p>
                    </div>

                    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
                      <div className="space-y-6">
                        <div className="rounded-[24px] border border-slate-200 bg-white p-6">
                          <div className="mb-5 text-sm font-semibold text-slate-950">
                            1. Escolha o plano base
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {FLOWDESK_PLANS.map((plan) => {
                              const active = selectedPlan === plan.key;

                              return (
                                <PlanOptionCard
                                  key={plan.key}
                                  plan={plan}
                                  active={active}
                                  onClick={() => selectPlan(plan.key)}
                                />
                              );
                            })}
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                          <div className="mb-4 text-sm font-semibold text-slate-950">
                            2. Quantos usuários sua empresa precisa?
                          </div>

                          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="text-sm text-slate-600">
                                O plano{" "}
                                <span className="font-semibold text-slate-950">
                                  {activeFlowDeskPlan.title}
                                </span>{" "}
                                inclui{" "}
                                <span className="font-semibold text-cyan-700">
                                  {activeFlowDeskPlan.usersIncluded}
                                </span>{" "}
                                usuário
                                {activeFlowDeskPlan.usersIncluded > 1 ? "s" : ""}
                              </div>

                              <div className="mt-1 text-xs text-slate-500">
                                Usuário extra: {formatCurrency(EXTRA_USER_PRICE)}{" "}
                                / mês
                              </div>
                            </div>

                            <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setDesiredUsers((prev) =>
                                    Math.max(
                                      activeFlowDeskPlan.usersIncluded,
                                      prev - 1
                                    )
                                  )
                                }
                                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <div className="min-w-[120px] px-4 text-center">
                                <div className="text-2xl font-black text-slate-950">
                                  {normalizedUsers}
                                </div>
                                <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                  usuários
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setDesiredUsers((prev) => prev + 1)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                          <div className="mb-4 text-sm font-semibold text-slate-950">
                            3. Adicionais opcionais
                          </div>

                          <div className="grid gap-4 lg:grid-cols-2">
                            <AddonCard
                              active={includeWhatsapp}
                              onToggle={() => setIncludeWhatsapp((prev) => !prev)}
                              icon={<MessageCircle className="h-5 w-5" />}
                              title="Atendimento / WhatsApp"
                              description="Módulo opcional para empresas que precisam de operação de atendimento integrada. API oficial e consumo por conta do cliente."
                              price={formatCurrency(WHATSAPP_ADDON_PRICE)}
                              note="API e consumo não inclusos"
                            />

                            <AddonCard
                              active={includeCampaigns}
                              onToggle={() => setIncludeCampaigns((prev) => !prev)}
                              icon={<Megaphone className="h-5 w-5" />}
                              title="Campanhas"
                              description="Controle campanhas, origem dos leads e performance comercial em uma camada extra de inteligência."
                              price={formatCurrency(CAMPAIGNS_ADDON_PRICE)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[28px] border border-violet-200 bg-[linear-gradient(180deg,#f5f3ff_0%,#ffffff_100%)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                        <div className="mb-4 inline-flex rounded-xl bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                          Resumo estimado
                        </div>

                        <h4 className="text-2xl font-bold text-slate-950">
                          {activeFlowDeskPlan.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-600">
                          {activeFlowDeskPlan.subtitle}
                        </p>

                        <div className="mt-6 space-y-3 text-sm text-slate-600">
                          <PriceRow
                            label={`Plano base (${activeFlowDeskPlan.title})`}
                            value={formatCurrency(activeFlowDeskPlan.price)}
                          />
                          <PriceRow
                            label="Usuários incluídos"
                            value={`${activeFlowDeskPlan.usersIncluded}`}
                          />
                          <PriceRow
                            label={`Usuários extras (${extraUsers})`}
                            value={formatCurrency(extraUsersTotal)}
                          />
                          <PriceRow
                            label="Atendimento / WhatsApp"
                            value={
                              includeWhatsapp
                                ? formatCurrency(WHATSAPP_ADDON_PRICE)
                                : "Não adicionado"
                            }
                          />
                          <PriceRow
                            label="Campanhas"
                            value={
                              includeCampaigns
                                ? formatCurrency(CAMPAIGNS_ADDON_PRICE)
                                : "Não adicionado"
                            }
                          />
                        </div>

                        {includeWhatsapp && (
                          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-700">
                            O módulo de WhatsApp não inclui custos de API. A
                            conta, a API oficial e o consumo ficam por conta do
                            cliente.
                          </div>
                        )}

                        <div className="my-6 h-px bg-slate-200" />

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                            Valor mensal estimado
                          </div>
                          <div className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
                            {formatCurrency(estimatedTotal)}
                          </div>
                        </div>

                        <a
                          href={buildWhatsappLink()}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(139,92,246,0.22)] transition hover:scale-[1.02] hover:from-fuchsia-500 hover:to-violet-500"
                        >
                          Solicitar este plano
                          <ArrowRight className="h-4 w-4" />
                        </a>

                        <p className="mt-3 text-xs leading-relaxed text-slate-500">
                          O valor estimado pode variar conforme a configuração
                          final da operação e módulos contratados.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeProduct.slug === "agendaflow" && (
                <div className="mt-8 rounded-[28px] border border-emerald-200 bg-emerald-50/50 p-6">
                  <div className="mb-4 text-lg font-bold text-slate-950">
                    O que vende melhor no AgendaFlow
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MiniInfo
                      icon={<CalendarClock className="h-4 w-4" />}
                      label="Agenda online 24h"
                      text="O cliente agenda com facilidade sem depender só do WhatsApp."
                    />
                    <MiniInfo
                      icon={<Wallet className="h-4 w-4" />}
                      label="Pix integrado"
                      text="Receba sinal ou pagamento antecipado para reduzir faltas."
                    />
                    <MiniInfo
                      icon={<Users className="h-4 w-4" />}
                      label="Equipe organizada"
                      text="Controle profissionais, serviços, horários e bloqueios."
                    />
                    <MiniInfo
                      icon={<Sparkles className="h-4 w-4" />}
                      label="Experiência premium"
                      text="Visual moderno no mobile e desktop para passar mais credibilidade."
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={activeProduct.ctaHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                    >
                      {activeProduct.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </a>

                    <a
                      href={activeProduct.secondaryHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {activeProduct.secondaryLabel}
                    </a>
                  </div>
                </div>
              )}

              {activeProduct.slug === "imobflow" && (
                <div className="mt-8 rounded-[28px] border border-violet-200 bg-violet-50/50 p-6">
                  <div className="mb-4 text-lg font-bold text-slate-950">
                    O que destaca o ImobFlow
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MiniInfo
                      icon={<Building2 className="h-4 w-4" />}
                      label="Operação imobiliária real"
                      text="Pensado para contratos, imóveis, financeiro e inadimplência."
                    />
                    <MiniInfo
                      icon={<Wallet className="h-4 w-4" />}
                      label="Controle financeiro"
                      text="Mais visibilidade sobre caixa, recebimentos e pendências."
                    />
                    <MiniInfo
                      icon={<BarChart3 className="h-4 w-4" />}
                      label="Dashboards e relatórios"
                      text="Leitura gerencial mais clara para decisões seguras."
                    />
                    <MiniInfo
                      icon={<ShieldCheck className="h-4 w-4" />}
                      label="Mais segurança"
                      text="Menos retrabalho e mais estrutura para a operação."
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={activeProduct.ctaHref}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                    >
                      {activeProduct.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </a>

                    <a
                      href={activeProduct.secondaryHref}
                      className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {activeProduct.secondaryLabel}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MiniStat({
  icon,
  title,
  value,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  tone: "cyan" | "violet" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-200 bg-cyan-50 text-cyan-700"
      : tone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium">{title}</span>
      </div>
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${toneClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function DetailBlock({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <span className="text-cyan-700">{icon}</span>
        {title}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
            <span className="text-sm leading-relaxed text-slate-600">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniInfo({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <span className="text-cyan-700">{icon}</span>
        {label}
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

function AddonCard({
  active,
  onToggle,
  icon,
  title,
  description,
  price,
  note,
}: {
  active: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  note?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "w-full rounded-[24px] border p-4 text-left transition",
        active
          ? "border-cyan-300 bg-cyan-50"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-cyan-700">
            {icon}
          </div>
          <div className="text-base font-semibold text-slate-950">{title}</div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
          {note && (
            <div className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
              {note}
            </div>
          )}
        </div>

        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold text-slate-950">{price}</div>
          <div className="text-xs text-slate-500">/mês</div>
          <div
            className={[
              "mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
              active
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-600",
            ].join(" ")}
          >
            {active ? "Adicionado" : "Opcional"}
          </div>
        </div>
      </div>
    </button>
  );
}

function PlanOptionCard({
  plan,
  active,
  onClick,
}: {
  plan: FlowDeskPlan;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative w-full min-w-0 overflow-hidden rounded-[24px] border p-5 text-left transition",
        "min-h-[220px]",
        active
          ? "border-cyan-300 bg-cyan-50 shadow-[0_12px_30px_rgba(34,211,238,0.10)]"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      {plan.recommended && (
        <div className="absolute right-4 top-4 inline-flex rounded-full bg-purple-600 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
          Mais escolhido
        </div>
      )}

      <div className={plan.recommended ? "pr-28" : "pr-4"}>
        <div className="text-[20px] font-bold leading-none text-slate-950 md:text-[22px]">
          {plan.title}
        </div>

        <div className="mt-3 max-w-[220px] text-sm leading-5 text-slate-500">
          {plan.subtitle}
        </div>
      </div>

      <div className="mt-8 min-w-0">
        <div className="text-[24px] font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-[28px] xl:text-[30px] 2xl:text-[32px]">
          {formatCurrency(plan.price)}
        </div>
        <div className="mt-2 text-sm text-slate-500">/mês</div>
      </div>

      <div className="mt-6 inline-flex max-w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
        <span className="truncate">
          {plan.usersIncluded} usuário{plan.usersIncluded > 1 ? "s" : ""} incluído
          {plan.usersIncluded > 1 ? "s" : ""}
        </span>
      </div>
    </button>
  );
}

function PriceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-950">{value}</span>
    </div>
  );
}
