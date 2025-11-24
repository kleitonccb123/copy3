import React, { useState } from 'react';
import VSLPage from './components/VSLPage';
import ThankYouPage from './components/ThankYouPage';
import { PageRoute } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  const handleLeadSuccess = () => {
    setCurrentPage('thank-you');
    window.scrollTo(0, 0);
  };

  return (
    <div className="antialiased selection:bg-brand-primary selection:text-black">
      {currentPage === 'home' && (
        <VSLPage onSuccess={handleLeadSuccess} />
      )}
      
      {currentPage === 'thank-you' && (
        <ThankYouPage />
      )}
      
      {/* Footer / Copyright - Optional but good for credibility */}
      <footer className="fixed bottom-0 w-full py-4 text-center text-gray-700 text-xs pointer-events-none z-0">
        <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;