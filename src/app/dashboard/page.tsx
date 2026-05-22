import { prisma } from "@/lib/prisma";
import { Plus, Clock, CheckCircle2, XCircle, CalendarClock } from "lucide-react";
import CreateAppointmentModal from "@/components/CreateAppointmentModal";
import AppointmentActions from "@/components/AppointmentActions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "asc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysAppointments = appointments.filter(a => {
    const aDate = new Date(a.date);
    aDate.setHours(0, 0, 0, 0);
    return aDate.getTime() === today.getTime();
  });

  const pendingCount = appointments.filter(a => a.status === "PENDING").length;

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gradient-gold">Painel de Agendamentos</h1>
          <p className="text-foreground/60 mt-1">Gerencie seus horários e clientes</p>
        </div>
        <CreateAppointmentModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-gold-400 mb-2">
            <CalendarClock className="w-5 h-5" />
            <h3 className="font-medium">Para Hoje</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{todaysAppointments.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <Clock className="w-5 h-5" />
            <h3 className="font-medium">Aguardando Confirmação</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-medium">Total Confirmados</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {appointments.filter(a => a.status === "CONFIRMED").length}
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-serif">Próximos Horários</h2>
        </div>
        
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-foreground/50">
            <p>Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-foreground/60 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Cliente</th>
                  <th className="p-4 font-medium">Data & Hora</th>
                  <th className="p-4 font-medium">Serviço</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Link Privado</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{apt.clientName}</p>
                      <p className="text-xs text-foreground/50">{apt.clientPhone}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">
                        {new Date(apt.date).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-xs text-gold-400">
                        {new Date(apt.date).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="p-4 text-foreground/80">{apt.serviceType}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        apt.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        apt.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {apt.status === "CONFIRMED" ? "Confirmado" : apt.status === "PENDING" ? "Pendente" : "Cancelado"}
                      </span>
                    </td>
                    <td className="p-4">
                      <AppointmentActions appointment={apt} type="link" />
                    </td>
                    <td className="p-4 text-right">
                      <AppointmentActions appointment={apt} type="actions" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
