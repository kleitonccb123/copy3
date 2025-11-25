import React, { useEffect } from 'react';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

declare global {
  interface Window {
    fbq: any;
  }
}

const ThankYouPage: React.FC = () => {
  const WHATSAPP_URL = "https://chat.whatsapp.com/FBNQeg1MOgeA3OLvB72uri";

  useEffect(() => {
    // 1. Rastrear o Evento LEAD apenas nesta página
    // Verificamos se a função fbq existe antes de chamar para evitar erros
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
      console.log("✅ Facebook Pixel: Evento 'Lead' disparado com sucesso!");
    } else {
      console.warn("⚠️ Facebook Pixel não detectado. Verifique se o AdBlock está desativado.");
    }

    // 2. Redirecionamento Automático (Seguro)
    // Aumentado para 2000ms (2 segundos) para garantir que o navegador tenha tempo
    // de enviar a requisição do Pixel antes de mudar de página.
    const timeout = setTimeout(() => {
      window.location.href = WHATSAPP_URL;
    }, 2000); 

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4 font-inter">
      <div className="bg-brand-card border border-white/10 max-w-md w-full rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden animate-fade-in-up">
        
        {/* Background Glow (Subtle) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#00a1ff] to-transparent"></div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00a1ff]/20 blur-xl rounded-full"></div>
            <CheckCircle2 className="w-20 h-20 text-[#00a1ff] relative z-10" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Cadastro Confirmado!
        </h1>
        
        <p className="text-gray-300 mb-6">
          Você será redirecionado para o nosso Grupo VIP no WhatsApp...
        </p>

        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[#00a1ff] font-semibold bg-[#00a1ff]/10 px-4 py-2 rounded-full border border-[#00a1ff]/20">
                <Loader2 className="animate-spin" size={18} />
                <span>Aguarde, redirecionando...</span>
            </div>

            <a 
            href={WHATSAPP_URL}
            className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1 group mt-2"
            >
            Não foi redirecionado? Clique aqui <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
            </a>
        </div>

      </div>
    </div>
  );
};

export default ThankYouPage;