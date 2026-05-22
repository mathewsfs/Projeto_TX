import { prisma } from "@/lib/prisma";
import { Package, Diamond, DollarSign, TrendingUp } from "lucide-react";
import CreateJewelryModal from "@/components/CreateJewelryModal";

export const dynamic = "force-dynamic";

export default async function EstoquePage() {
  const items = await prisma.jewelryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const availableCount = items.filter(i => i.status === "AVAILABLE").length;
  const totalCost = items.reduce((acc, curr) => acc + curr.costValue, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gradient-gold">Gestão de Estoque</h1>
          <p className="text-foreground/60 mt-1">Acervo exclusivo de joias e peças</p>
        </div>
        <CreateJewelryModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-gold-400 mb-2">
            <Package className="w-5 h-5" />
            <h3 className="font-medium">Total de Peças</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{items.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <Diamond className="w-5 h-5" />
            <h3 className="font-medium">Peças Disponíveis</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{availableCount}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <DollarSign className="w-5 h-5" />
            <h3 className="font-medium">Custo Total (Em Estoque)</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalCost)}
          </p>
        </div>
      </div>

      {/* Items List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-serif">Acervo</h2>
        </div>
        
        {items.length === 0 ? (
          <div className="p-12 text-center text-foreground/50">
            <p>Nenhuma peça cadastrada no estoque.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-foreground/60 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium w-20">Foto</th>
                  <th className="p-4 font-medium">Código (SKU)</th>
                  <th className="p-4 font-medium">Peça</th>
                  <th className="p-4 font-medium">Material / Pedras</th>
                  <th className="p-4 font-medium">Custo</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {item.images && item.images.length > 0 ? (
                        <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/5 overflow-hidden">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-foreground/30">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-sm text-foreground/70">{item.code}</td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-foreground/50">{item.type}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground/80">{item.material}</p>
                      {item.stones && <p className="text-xs text-gold-400">{item.stones}</p>}
                    </td>
                    <td className="p-4 text-sm">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.costValue)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        item.status === "SOLD" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {item.status === "AVAILABLE" ? "Disponível" : item.status === "SOLD" ? "Vendido" : "Consignado"}
                      </span>
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
