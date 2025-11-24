import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, ShieldCheck, Lock, ChevronDown } from 'lucide-react';
import ExitIntentModal from './ExitIntentModal';
import { submitLead } from '../lib/supabase';

interface VSLPageProps {
  onSuccess: () => void;
}

// Configuration
const FORM_DELAY_SECONDS = 5; // Set to 5s for testing (change to video duration for prod)
const YOUTUBE_VIDEO_ID = "a-wS3tKSHq0"; // ID extracted from URL

const VSLPage: React.FC<VSLPageProps> = ({ onSuccess }) => {
  // Video & Layout State
  const [isPlaying, setIsPlaying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Play Video Logic
  const handlePlay = () => {
    setIsPlaying(true);
    
    // Start timer to show form
    setTimeout(() => {
      revealForm();
    }, FORM_DELAY_SECONDS * 1000);
  };

  // Reveal Form Logic
  const revealForm = () => {
    setShowForm(true);
    // Smooth scroll to form if needed, shortly after render
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Skip Video Action (from Modal)
  const handleSkipVideo = () => {
    // For YouTube iframe, we can't easily pause without external API, 
    // but revealing the form is the priority action.
    revealForm();
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await submitLead(formData.nome, formData.email, formData.telefone);
      
      if (error) {
        // Handle specific Supabase errors
        const errMsg = (error as any).message || "Erro desconhecido";
        
        if (errMsg.includes("row-level security")) {
          throw new Error("Erro de Permissão: O banco de dados bloqueou a gravação (RLS Policy). Verifique o Supabase.");
        } else {
          throw new Error(errMsg);
        }
      }
      
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao salvar seus dados. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-brand-black pb-20 overflow-x-hidden">
      
      {/* Exit Intent Modal */}
      <ExitIntentModal 
        isOpen={modalOpen} 
        setIsOpen={setModalOpen}
        hasTriggered={exitIntentTriggered}
        setHasTriggered={setExitIntentTriggered}
        onConfirm={handleSkipVideo}
      />

      {/* Header / Headline */}
      <header className="w-full max-w-4xl px-6 pt-10 pb-6 text-center z-10">
        <div className="inline-block px-3 py-1 mb-4 border border-brand-primary/30 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-widest uppercase animate-pulse">
          Atenção: Oferta Limitada
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
          Descubra o Método Secreto para <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Escalar Suas Vendas</span> em 30 Dias
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Assista ao vídeo curto abaixo antes que ele saia do ar.
        </p>
      </header>

      {/* VSL Area */}
      <div className="w-full max-w-4xl px-4 relative group">
        <div className="relative w-full aspect-video bg-brand-card rounded-2xl border border-brand-primary/20 shadow-glow-blue overflow-hidden">
          
          {isPlaying ? (
             <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&modestbranding=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&fs=0`} 
                title="VSL Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="w-full h-full"
            ></iframe>
          ) : (
            <>
                {/* Thumbnail Image */}
                <img 
                    src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover opacity-60"
                />

                {/* Custom Big Play Button Overlay */}
                <div 
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300"
                  onClick={handlePlay}
                >
                  <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center shadow-glow-blue animate-pulse group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-10 h-10 text-brand-black ml-2 fill-current" />
                  </div>
                  <p className="mt-6 text-xl font-semibold text-white tracking-wide shadow-black drop-shadow-md">
                    Clique para assistir com som <Volume2 className="inline ml-1 w-5 h-5 align-text-bottom text-brand-accent"/>
                  </p>
                </div>
            </>
          )}
          
        </div>
        
        {/* Anti-skip message */}
        <div className="mt-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
            <Lock size={14} /> Vídeo seguro e exclusivo. Por favor, assista até o final.
        </div>
      </div>

      {/* Hidden Section (Reveals after timer) */}
      <div 
        ref={formRef}
        className={`w-full max-w-xl px-4 mt-12 transition-all duration-1000 ease-out transform ${
          showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        <div className="bg-brand-card border border-brand-primary/20 p-8 rounded-2xl shadow-glow-blue relative overflow-hidden">
          {/* Decorative glow inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="text-center mb-8 relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">Garanta Sua Vaga Agora</h2>
            <p className="text-gray-400 text-sm">Preencha seus dados abaixo para acessar o conteúdo completo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="nome" className="text-sm font-medium text-gray-300 ml-1">Nome Completo</label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                placeholder="Seu nome aqui"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full bg-[#050e18] border border-brand-card focus:border-brand-accent text-white p-4 rounded-lg outline-none transition-all duration-300 placeholder-gray-600 focus:shadow-[0_0_20px_rgba(0,234,255,0.3)]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">Melhor E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#050e18] border border-brand-card focus:border-brand-accent text-white p-4 rounded-lg outline-none transition-all duration-300 placeholder-gray-600 focus:shadow-[0_0_20px_rgba(0,234,255,0.3)]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="telefone" className="text-sm font-medium text-gray-300 ml-1">WhatsApp</label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                required
                placeholder="(DDD) 99999-9999"
                value={formData.telefone}
                onChange={handleInputChange}
                className="w-full bg-[#050e18] border border-brand-card focus:border-brand-accent text-white p-4 rounded-lg outline-none transition-all duration-300 placeholder-gray-600 focus:shadow-[0_0_20px_rgba(0,234,255,0.3)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-brand-primary to-[#0088cc] hover:from-brand-accent hover:to-brand-primary text-black font-bold text-lg py-4 rounded-lg shadow-glow-blue hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  QUERO MINHA VAGA AGORA <ShieldCheck size={20} />
                </>
              )}
            </button>
            
            <div className="text-center">
                <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Lock size={10} /> Seus dados estão 100% seguros
                </span>
            </div>
          </form>
        </div>
      </div>

      {!showForm && isPlaying && (
        <div className="mt-8 animate-bounce text-brand-primary/50">
            <ChevronDown size={32} />
        </div>
      )}
    </div>
  );
};

export default VSLPage;