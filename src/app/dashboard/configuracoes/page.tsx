import { prisma } from "@/lib/prisma";
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const googleToken = await prisma.systemSetting.findUnique({
    where: { key: "GOOGLE_CALENDAR_REFRESH_TOKEN" }
  });

  const isConnected = !!googleToken;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-gradient-gold">Configurações do Sistema</h1>
        <p className="text-foreground/60 mt-1">Gerencie integrações e preferências globais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Integração Google Calendar */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <Calendar className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-foreground">Google Calendar</h2>
              <p className="text-sm text-foreground/50">Sincronização automática de agendamentos</p>
            </div>
          </div>

          <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5">
            {isConnected ? (
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium text-sm">Conta conectada e sincronizando</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium text-sm">Nenhuma conta vinculada</span>
              </div>
            )}
            <p className="text-xs text-foreground/40 mt-2">
              Ao confirmar um agendamento, um evento será criado automaticamente na agenda conectada e um e-mail de convite será disparado para o cliente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isConnected ? (
              <button disabled className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-medium text-sm transition-all hover:bg-red-500/20">
                Desconectar
              </button>
            ) : (
              <a href="/api/google/auth" className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm transition-all shadow-lg flex items-center gap-2 hover:bg-white/90">
                Conectar Conta Google
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
