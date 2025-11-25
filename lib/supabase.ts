import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

const supabaseUrl = 'https://xhcjvbnnhmgoqirndhzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoY2p2Ym5uaG1nb3Fpcm5kaHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODc5MzIsImV4cCI6MjA3OTU2MzkzMn0.gd9nWKl85u7sLJgEuyhgbK6Asfvkp0IJga9bAHrelQw';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const submitLead = async (nome: string, email: string, telefone: string, capital: string) => {
  try {
    // Tentativa 1: Enviar com todos os campos (Cenário Ideal)
    const { data, error } = await supabase
      .from('leads')
      .insert([{ nome, email, telefone, capital }])
      .select();
    
    if (error) {
      // Tratamento de Erro Específico: Coluna 'capital' inexistente no banco (PGRST204)
      // Isso acontece se o usuário esqueceu de rodar o SQL: alter table leads add column capital text;
      // O código 400 também pode ocorrer em alguns casos de schema mismatch.
      if (error.code === 'PGRST204' || error.message.includes('capital') || error.code === '42703') {
        console.warn("⚠️ AVISO: A coluna 'capital' não existe no Supabase. Tentando salvar sem ela (Fallback). POR FAVOR, RODE NO SUPABASE: alter table leads add column capital text;");
        
        // Tentativa 2: Fallback (Degradação Graciosa) - Salva o que é possível (Nome, Email, Telefone)
        // Isso garante que o lead não seja perdido.
        const { data: retryData, error: retryError } = await supabase
          .from('leads')
          .insert([{ nome, email, telefone }])
          .select();
          
        if (retryError) {
             console.error("Erro Crítico no Fallback:", JSON.stringify(retryError, null, 2));
             return { data: null, error: retryError };
        }
        
        // Sucesso parcial (Lead salvo, mas sem capital)
        return { data: retryData, error: null };
      }

      console.error("Supabase Error Details:", JSON.stringify(error, null, 2));
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error("Unexpected Error:", err);
    return { data: null, error: err };
  }
};