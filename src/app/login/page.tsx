"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";


export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isFormValid = useMemo(() => {
    return email.trim().length > 4 && password.trim().length >= 6;
  }, [email, password]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    if (!isFormValid) {
      setErrorMsg("Preencha e-mail e senha corretamente.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Não foi possível entrar.");
        return;
      }

      router.push("/portal");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg("Não foi possível entrar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_30%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold text-white shadow-lg ring-1 ring-white/10 backdrop-blur">
                WD
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold text-white/60">
                  Web Division
                </div>
                <div className="text-base font-bold text-white">
                  Portal do Cliente
                </div>
              </div>
            </Link>

            <a
              href="https://wa.me/5562994693465"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 md:inline-flex"
            >
              <MessageCircle size={16} />
              Suporte no WhatsApp
            </a>
          </div>

          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                <ShieldCheck size={16} />
                Ambiente seguro para acompanhamento do seu projeto
              </div>

              <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
                Acompanhe o andamento do seu projeto em tempo real.
              </h1>

              <p className="mt-5 text-base leading-7 text-white/70 md:text-lg">
                Veja tarefas em andamento, etapas concluídas, observações da
                equipe e status completo da entrega em um painel profissional da
                Web Division.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Visão clara do projeto
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Saiba exatamente o que está em andamento, em revisão ou já
                    concluído.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400/10 text-blue-300">
                    <LayoutDashboard size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Comunicação centralizada
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Observações, etapas e histórico organizados num só lugar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="rounded-[32px] border border-white/10 bg-[#0b1728]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                    Acesso restrito
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-white">
                    Entrar no portal
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Use seus dados de acesso para acompanhar suas atividades,
                    entregas e próximas etapas do projeto.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      E-mail
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <Mail size={18} className="text-white/45" />
                      <input
                        type="email"
                        placeholder="seuemail@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Senha
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <Lock size={18} className="text-white/45" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-white/45 transition hover:text-white"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {errorMsg ? (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {errorMsg}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-[#07111f] transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Entrando..." : "Acessar portal"}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>

                <div className="mt-5 flex items-center justify-between gap-3 text-xs text-white/45">
                  <span>Acesso liberado pela equipe Web Division</span>
                  <a
                    href="https://wa.me/5562994693465"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Solicitar acesso
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}