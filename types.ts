export interface Lead {
  nome: string;
  email: string;
  telefone: string;
  capital: string;
}

export type PageRoute = 'home' | 'thank-you';

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: number;
          created_at: string;
          nome: string | null;
          email: string | null;
          telefone: string | null;
          capital: string | null;
        };
        Insert: {
          nome?: string | null;
          email?: string | null;
          telefone?: string | null;
          capital?: string | null;
        };
      };
    };
  };
}