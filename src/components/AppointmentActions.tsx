"use client";

import { Copy, Trash2, Link as LinkIcon, CheckCircle2, XCircle } from "lucide-react";
import { updateAppointmentStatus } from "@/app/actions/appointments";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AppointmentActions({ appointment, type }: { appointment: any; type: "link" | "actions" }) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/agendamento/${appointment.token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (status: "PENDING" | "CONFIRMED" | "CANCELED") => {
    const res = await updateAppointmentStatus(appointment.id, status);
    if (!res.success) {
      alert("Erro ao atualizar status");
    }
  };

  if (type === "link") {
    return (
      <button 
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-xs text-foreground/70 hover:text-gold-400 transition-colors"
      >
        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copiado!" : "Copiar Link"}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {appointment.status !== "CONFIRMED" && (
        <button 
          onClick={() => handleStatusChange("CONFIRMED")}
          title="Confirmar"
          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
      )}
      {appointment.status !== "CANCELED" && (
        <button 
          onClick={() => handleStatusChange("CANCELED")}
          title="Cancelar"
          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
