import { Calendar, Clock, MapPin, CheckCircle2, XCircle, CalendarClock, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppointmentActions from "@/components/AppointmentActions";
import Image from "next/image";

export default async function AgendamentoPublicoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { token }
  });

  if (!appointment) {
    return notFound();
  }

  const isConfirmed = appointment.status === "CONFIRMED";
  const isCanceled = appointment.status === "CANCELED";

  return (
    <div className="min-h-screen bg-background flex flex-col pt-8 pb-20 px-4 sm:px-6">
      {/* Header */}
      <header className="flex flex-col items-center mb-10 mt-4">
        <Image
          src="/logo.png"
          alt="Juni Body Piercer"
          width={80}
          height={80}
          className="mb-3 drop-shadow-[0_0_16px_rgba(198,155,54,0.25)]"
        />
        <h1 className="font-serif text-3xl font-bold text-gradient-gold mb-2 text-center">Juni Body Piercer</h1>
        <p className="text-sm text-foreground/60 tracking-widest uppercase">Atendimento Exclusivo</p>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto glass-panel rounded-3xl p-6 sm:p-8 flex-1 flex flex-col relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-[50px] rounded-full pointer-events-none" />
        
        <h2 className="text-2xl font-serif text-foreground mb-6">
          Olá, <span className="text-gold-400 font-semibold">{appointment.clientName.split(' ')[0]}</span>.
        </h2>
        
        <p className="text-foreground/80 font-light mb-8 leading-relaxed">
          Este é o resumo do seu agendamento em nossa joalheria. Confira os detalhes abaixo:
        </p>

        {/* Appointment Details */}
        <div className="space-y-5 bg-black/40 p-5 rounded-2xl border border-white/5 mb-8 relative">
          
          {isCanceled && (
            <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-red-500/30">
              <XCircle className="w-12 h-12 text-red-400 mb-3" />
              <p className="font-bold text-red-400 text-lg">Agendamento Cancelado</p>
              <p className="text-sm text-red-200/70 mt-1">Este horário não está mais reservado.</p>
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="mt-1 w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center shrink-0 border border-gold-500/20">
              <Calendar className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Data</p>
              <p className="text-foreground font-medium text-lg">
                {new Date(appointment.date).toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center shrink-0 border border-gold-500/20">
              <Clock className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Horário</p>
              <p className="text-foreground font-medium text-lg">
                {new Date(appointment.date).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center shrink-0 border border-gold-500/20">
              <CalendarClock className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">Serviço</p>
              <p className="text-foreground font-medium text-lg">{appointment.serviceType}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isCanceled && (
          <div className="mt-auto space-y-3">
            {isConfirmed ? (
               <div className="w-full py-4 px-6 rounded-2xl bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-5 h-5" />
                 Presença Confirmada
               </div>
            ) : (
              <AppointmentActions appointment={appointment} type="actions" />
            )}
            
            <p className="text-center text-xs text-foreground/40 mt-4">
              Precisa reagendar? Entre em contato pelo WhatsApp.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-xs text-foreground/40 font-light px-4">
        Ao confirmar, você receberá um convite no seu Google Calendar.
      </footer>
    </div>
  );
}
