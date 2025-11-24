import React, { useEffect } from 'react';
import { CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  
  // Tracking Scripts Injection
  useEffect(() => {
    // This is where you manually inject the Meta Pixel 'Lead' event
    // Ideally this would be done via GTM, but here is the manual simulation
    
    // Example:
    // if (window.fbq) {
    //   window.fbq('track', 'Lead');
    // }
    
    console.log("Tracking Event: Lead Triggered");
  }, []);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="bg-brand-card border border-brand-primary/20 max-w-lg w-full rounded-2xl p-10 text-center shadow-glow-blue relative overflow-hidden animate-fade-in-up">
        
        {/* Background Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-transparent via-brand-primary to-transparent"></div>
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full"></div>
            <CheckCircle2 className="w-24 h-24 text-brand-primary relative z-10" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Cadastro Confirmado!
        </h1>
        
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Obrigado pelo seu interesse. Seus dados foram recebidos com sucesso. Em breve, um de nossos especialistas entrará em contato via WhatsApp.
        </p>

        <div className="bg-brand-black/50 rounded-xl p-6 border border-brand-primary/10 mb-8">
          <p className="text-sm text-gray-400 mb-2">Próximo Passo:</p>
          <p className="text-white font-medium flex items-center justify-center gap-2">
            Fique atento ao seu telefone <MessageSquare size={16} className="text-brand-accent"/>
          </p>
        </div>

        <a 
          href="#"
          className="inline-flex items-center text-brand-primary hover:text-brand-accent transition-colors font-medium group"
        >
          Voltar para o início <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform"/>
        </a>

        {/* Placeholder for Head Injection */}
        <div id="tracking-scripts-placeholder" style={{ display: 'none' }}>
           {/* 
              Paste your Meta Pixel Code in index.html head or use GTM.
              The Lead event is triggered in the useEffect above.
           */}
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;