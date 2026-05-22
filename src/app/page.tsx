import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-900/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="z-10 flex flex-col items-center text-center px-6 max-w-3xl glass-panel p-12 rounded-2xl">
        <Image
          src="/logo.png"
          alt="Juni Body Piercer"
          width={110}
          height={110}
          className="mb-6 drop-shadow-[0_0_30px_rgba(198,155,54,0.4)]"
          priority
        />
        
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-4 text-gradient-gold">
          Juni Body Piercer
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/70 mb-10 font-light max-w-lg">
          Sistema interno de gestão de agendamentos e controle de acervo exclusivo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="px-8 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-gold-950 font-medium transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(198,155,54,0.3)]"
          >
            Acesso Restrito
          </Link>
        </div>
      </main>
      
      <footer className="absolute bottom-8 text-sm text-foreground/40 font-light">
        &copy; {new Date().getFullYear()} Juni Body Piercer. Todos os direitos reservados.
      </footer>
    </div>
  );
}
