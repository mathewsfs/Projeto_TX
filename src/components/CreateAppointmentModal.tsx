"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createAppointment } from "@/app/actions/appointments";
import { useRouter } from "next/navigation";

export default function CreateAppointmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    date: "",
    time: "",
    serviceType: "Perfuração Corporal",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create a local date object from the inputs
      const appointmentDate = new Date(`${formData.date}T${formData.time}:00`);

      const res = await createAppointment({
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        serviceType: formData.serviceType,
        date: appointmentDate,
        notes: formData.notes,
      });

      if (res.success) {
        setIsOpen(false);
        setFormData({
          clientName: "",
          clientPhone: "",
          date: "",
          time: "",
          serviceType: "Perfuração Corporal",
          notes: "",
        });
        router.refresh();
      } else {
        alert("Erro ao criar agendamento: " + res.error);
      }
    } catch (error) {
      alert("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-gold-950 font-semibold transition-all shadow-[0_0_15px_rgba(198,155,54,0.2)] flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Novo Agendamento
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <h2 className="text-2xl font-serif text-gradient-gold">Novo Agendamento</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="appointment-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Nome do Cliente</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors"
                    placeholder="Nome completo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Data</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Horário</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Tipo de Serviço</label>
                  <select
                    required
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors"
                  >
                    <option value="Perfuração Corporal">Perfuração Corporal</option>
                    <option value="Troca de Joia">Troca de Joia</option>
                    <option value="Avaliação">Avaliação</option>
                    <option value="Limpeza / Manutenção">Limpeza / Manutenção</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Observações (Opcional)</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                    placeholder="Alguma informação extra..."
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border/50 bg-black/20 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="appointment-form"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-gold-950 font-semibold transition-all shadow-[0_0_15px_rgba(198,155,54,0.2)] disabled:opacity-70 flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Cadastrar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
