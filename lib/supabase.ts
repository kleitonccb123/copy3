import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

const supabaseUrl = 'https://xhcjvbnnhmgoqirndhzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoY2p2Ym5uaG1nb3Fpcm5kaHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODc5MzIsImV4cCI6MjA3OTU2MzkzMn0.gd9nWKl85u7sLJgEuyhgbK6Asfvkp0IJga9bAHrelQw';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const submitLead = async (nome: string, email: string, telefone: string) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ nome, email, telefone }])
      .select(); // Select ensures we get the return data and validates the write
    
    if (error) {
      console.error("Supabase Error Details:", JSON.stringify(error, null, 2));
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error("Unexpected Error:", err);
    return { data: null, error: err };
  }
};