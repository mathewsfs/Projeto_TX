"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Ocorreu um erro ao fazer login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-12 pb-20 px-4 sm:px-6 relative overflow-hidden items-center justify-center">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Juni Body Piercer"
            width={90}
            height={90}
            className="mb-4 drop-shadow-[0_0_20px_rgba(198,155,54,0.3)]"
          />
          <h1 className="font-serif text-3xl font-bold text-gradient-gold mb-2">Juni Body Piercer</h1>
          <p className="text-foreground/60 font-light">Acesso restrito ao sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gold-500/50" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gold-500/50" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-4 rounded-2xl bg-gold-500 hover:bg-gold-400 text-gold-950 font-semibold transition-all shadow-[0_0_15px_rgba(198,155,54,0.2)] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-foreground/40 hover:text-gold-400 transition-colors">
            &larr; Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
