"use client";

import { useState } from "react";
import { Plus, X, Loader2, ImagePlus } from "lucide-react";
import { createJewelryItem } from "@/app/actions/inventory";
import { useRouter } from "next/navigation";

export default function CreateJewelryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "Anel",
    material: "Ouro 18k",
    stones: "",
    costValue: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("code", formData.code);
      form.append("name", formData.name);
      form.append("type", formData.type);
      form.append("material", formData.material);
      form.append("stones", formData.stones);
      form.append("costValue", formData.costValue.replace(",", "."));
      
      if (photo) {
        form.append("photo", photo);
      }

      const res = await createJewelryItem(form);

      if (res.success) {
        setIsOpen(false);
        setFormData({
          code: "",
          name: "",
          type: "Anel",
          material: "Ouro 18k",
          stones: "",
          costValue: "",
        });
        setPhoto(null);
        setPhotoPreview(null);
        router.refresh();
      } else {
        alert("Erro ao cadastrar peça: " + res.error);
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
        Cadastrar Peça
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <h2 className="text-2xl font-serif text-gradient-gold">Nova Peça</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="jewelry-form" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Photo Upload */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <label htmlFor="photo-upload" className="cursor-pointer group relative">
                    <div className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${photoPreview ? 'border-gold-500/50' : 'border-white/10 group-hover:border-white/30 bg-black/40'}`}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-foreground/50 group-hover:text-foreground/70">
                          <ImagePlus className="w-8 h-8 mb-1" />
                          <span className="text-[10px] uppercase font-medium">Adicionar Foto</span>
                        </div>
                      )}
                    </div>
                    {photoPreview && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <span className="text-xs text-white font-medium">Trocar</span>
                      </div>
                    )}
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Código (SKU)</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors uppercase"
                      placeholder="EX: AN001"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Nome / Descrição</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors"
                      placeholder="Meia aliança cravada"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Tipo</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors"
                    >
                      <option value="Anel">Anel</option>
                      <option value="Colar">Colar</option>
                      <option value="Brinco">Brinco</option>
                      <option value="Pulseira">Pulseira</option>
                      <option value="Piercing">Piercing</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Material</label>
                    <input
                      type="text"
                      required
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors"
                      placeholder="Ouro 18k Amarelo"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Pedras (Opcional)</label>
                  <input
                    type="text"
                    value={formData.stones}
                    onChange={(e) => setFormData({ ...formData, stones: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors"
                    placeholder="12 Diamantes, 1 Esmeralda"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-foreground/50 uppercase tracking-wider ml-1">Valor de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costValue}
                    onChange={(e) => setFormData({ ...formData, costValue: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-gold-500/50 transition-colors"
                    placeholder="0.00"
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
                form="jewelry-form"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-gold-950 font-semibold transition-all shadow-[0_0_15px_rgba(198,155,54,0.2)] disabled:opacity-70 flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Cadastrar Peça
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
