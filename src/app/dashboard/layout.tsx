import { Calendar, Package, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/50 bg-card/30 backdrop-blur-md">
        <div className="p-6 flex flex-col items-center border-b border-border/30">
          <Image src="/logo.png" alt="Juni Body Piercer" width={72} height={72} className="mb-3" />
          <h2 className="font-serif text-xl font-bold text-gradient-gold leading-tight">Juni</h2>
          <p className="text-xs text-foreground/50 uppercase tracking-widest">Body Piercer</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20 transition-all">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Agendamentos</span>
          </Link>
          <Link href="/dashboard/estoque" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-foreground/70 hover:text-foreground transition-all">
            <Package className="w-5 h-5" />
            <span className="font-medium">Estoque</span>
          </Link>
          <Link href="/dashboard/configuracoes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-foreground/70 hover:text-foreground transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-border/50 mt-auto">
          <div className="px-4 py-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-900/50 flex items-center justify-center text-gold-400 font-bold border border-gold-500/20">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{session?.user?.name}</p>
              <p className="text-xs text-foreground/50 truncate">{(session?.user as any)?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card/30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Juni" width={36} height={36} />
            <h2 className="font-serif text-xl font-bold text-gradient-gold">Juni</h2>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/5">
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
