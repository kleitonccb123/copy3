import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ExitIntentModalProps {
  onConfirm: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  hasTriggered: boolean;
  setHasTriggered: (triggered: boolean) => void;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ 
  onConfirm, 
  isOpen, 
  setIsOpen,
  hasTriggered,
  setHasTriggered
}) => {
  
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse left the top of the viewport
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggered, setIsOpen, setHasTriggered]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-brand-card border border-brand-primary/30 rounded-xl p-8 shadow-glow-blue">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="bg-brand-primary/10 p-4 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-brand-primary" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Sem tempo para assistir ao vídeo agora?
          </h2>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            Sabemos que a rotina empresarial é corrida. Se você já entende o poder da alavancagem financeira e quer ir direto aos fatos, pule o vídeo.
          </p>

          <button
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
            className="w-full py-4 bg-brand-primary hover:bg-brand-accent text-brand-black font-bold text-lg rounded-lg shadow-glow-blue hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-[1.02]"
          >
            PULAR VÍDEO E LIBERAR MEU ACESSO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal;