import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, User, Mail, Phone, TrendingUp, AlertTriangle, Lock, Play, MousePointerClick } from 'lucide-react';
import ExitIntentModal from './ExitIntentModal';
import { submitLead } from '../lib/supabase';

interface VSLPageProps {
  onSuccess: () => void;
}

// --- CONFIGURAÇÕES ---
const VIMEO_VIDEO_ID = "1140514322"; 
const PAGE_LOAD_DELAY_SECONDS = 600; // Tempo fallback (caso não dê play)
const VIDEO_PLAY_DELAY_SECONDS = 5; // Tempo para aparecer após dar PLAY

const VSLPage: React.FC<VSLPageProps> = ({ onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Novo estado para controlar o player
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  // Exit Intent State
  const [modalOpen, setModalOpen] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    telefone: '',
    capital: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capitalOptions = [
    { value: "1k-5k", label: "R$ 1k - 5k" },
    { value: "5k-10k", label: "R$ 5k - 10k" },
    { value: "10k-50k", label: "R$ 10k - 50k" },
    { value: "+50k", label: "+ R$ 50k" }
  ];

  // Fetch Vimeo Thumbnail Automaticamente
  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${VIMEO_VIDEO_ID}`);
        const data = await response.json();
        if (data.thumbnail_url) {
            setThumbnailUrl(data.thumbnail_url);
        }
      } catch (err) {
        console.warn("Não foi possível carregar a thumbnail do Vimeo automaticamente.", err);
      }
    };
    fetchThumbnail();
  }, []);

  // Timer Fallback (Baseado no carregamento da página)
  useEffect(() => {
    const timer = setTimeout(() => {
      revealForm();
    }, PAGE_LOAD_DELAY_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, []);

  const revealForm = () => {
    if (!showForm) {
      setShowForm(true);
    }
  };

  const handleSkipVideo = () => {
    revealForm();
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    // Lógica solicitada: Revelar formulário 5 segundos após o play
    setTimeout(() => {
        revealForm();
    }, VIDEO_PLAY_DELAY_SECONDS * 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!formData.capital) {
         throw new Error("Por favor, selecione uma das opções de capital.");
      }

      const { error } = await submitLead(formData.nome, formData.email, formData.telefone, formData.capital);
      
      if (error) {
        const errMsg = (error as any).message || "Erro desconhecido";
        if (errMsg.includes("row-level security")) {
          throw new Error("Erro de Permissão: O banco de dados bloqueou a gravação.");
        } else {
          throw new Error(errMsg);
        }
      }
      
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao salvar dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCapitalSelect = (value: string) => {
    setFormData(prev => ({ ...prev, capital: value }));
  };

  // Construção da URL do Vimeo Embed
  const videoSrc = `https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?autoplay=1&title=0&byline=0&portrait=0&badge=0`;

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 overflow-x-hidden relative font-inter">
      
      {/* Decorative Background Elements (Blobs) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '5s' }}></div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal 
        isOpen={modalOpen} 
        setIsOpen={setModalOpen}
        hasTriggered={exitIntentTriggered}
        setHasTriggered={setExitIntentTriggered}
        onConfirm={handleSkipVideo}
      />

      {/* Header */}
      <header className="w-full max-w-4xl px-6 pt-12 pb-8 text-center z-10">
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-[1.15] mb-6 tracking-tight">
          Automatize Seus Resultados <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-400 to-brand-accent">Sem Precisar Analisar Gráficos</span><br className="hidden md:block"/> Com O Nosso Copy Trader
        </h1>
        
        <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
          Assista ao vídeo curto abaixo para entender como nosso algoritmo trabalha por você 24 horas por dia.
        </p>
      </header>

      {/* Horizontal Video Area with Premium Frame */}
      <div className="w-full max-w-5xl px-4 md:px-8 relative z-20 mb-12">
        
        {/* Glow Effect Behind Video */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-brand-primary/20 blur-[60px] rounded-full -z-10"></div>

        {/* The Frame */}
        <div className="relative w-full aspect-video bg-[#050505] rounded-xl md:rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden group">
          
          {/* Inner Border/Reflection */}
          <div className="absolute inset-0 border border-white/5 rounded-xl md:rounded-2xl pointer-events-none z-20"></div>
          
          {/* Logic: Show Thumbnail/Button if NOT playing, Show Iframe if playing */}
          {!isPlaying ? (
            <div 
              className="absolute inset-0 w-full h-full cursor-pointer group"
              onClick={handlePlayVideo}
            >
              <div className="absolute inset-0 bg-black"></div>
              
              {/* Thumbnail Vimeo fetched via API */}
              {thumbnailUrl && (
                <img 
                    src={thumbnailUrl} 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                />
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-primary rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white translate-x-1" />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-0 w-full text-center z-10">
                <p className="text-white font-bold text-sm tracking-widest uppercase text-shadow">Clique para assistir</p>
              </div>
            </div>
          ) : (
            <iframe 
              src={videoSrc}
              title="Vimeo Video"
              className="absolute inset-0 w-full h-full z-10"
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
            ></iframe>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-gray-500">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <ShieldCheck size={14} className="text-brand-primary"/> 
                <span>Método Validado</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <Lock size={14} className="text-brand-primary"/> 
                <span>Acesso Seguro</span>
            </div>
        </div>
      </div>

      {/* Modern Glass Form */}
      <div 
        ref={formRef}
        className={`w-full max-w-lg px-4 transition-all duration-1000 ease-out z-20 ${
          showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        <div className={`glass-panel rounded-2xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-brand-primary/20 ${showForm ? 'animate-float' : ''}`}>
          
          {/* Form Header */}
          <div className="bg-brand-primary/5 p-6 md:p-8 text-center border-b border-white/5">
                <h2 className="text-2xl font-bold text-white mb-2">Garanta Sua Vaga</h2>
                <p className="text-gray-400 text-sm">
                   Preencha os dados abaixo para liberar seu acesso imediato ao Copy Trade.
                </p>
          </div>

          <div className="p-6 md:p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-xs flex items-center gap-3 animate-shake">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
                )}
                
                {/* Modern Inputs */}
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                        </div>
                        <input
                            name="nome"
                            type="text"
                            required
                            placeholder="Nome Completo"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className="block w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                        </div>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Seu Melhor E-mail"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="block w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                        </div>
                        <input
                            name="telefone"
                            type="tel"
                            required
                            placeholder="WhatsApp (com DDD)"
                            value={formData.telefone}
                            onChange={handleInputChange}
                            className="block w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <label className="block mb-3 ml-1">
                         <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Qual seu capital para investir?</span>
                            <span className="text-[10px] text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20 flex items-center gap-1 font-semibold animate-pulse">
                                <MousePointerClick size={12} /> Clique para selecionar
                            </span>
                         </div>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {capitalOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleCapitalSelect(option.value)}
                                className={`
                                    relative flex items-center justify-center p-3.5 rounded-xl border text-sm font-medium transition-all duration-200
                                    ${formData.capital === option.value 
                                        ? 'bg-brand-primary/20 border-brand-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                                        : 'bg-black/30 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10 hover:text-white'
                                    }
                                `}
                            >
                                {formData.capital === option.value && (
                                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_5px_#3b82f6]"></div>
                                )}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-gradient-to-r from-brand-primary to-blue-600 hover:to-blue-500 text-white font-bold text-lg py-4 rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,99,235,0.5)] active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isSubmitting ? (
                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                        QUERO ACESSAR AGORA <TrendingUp size={20} />
                        </>
                    )}
                </button>
                
                <p className="text-center text-[10px] text-gray-600">
                    Seus dados estão protegidos. Não enviamos spam.
                </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VSLPage;