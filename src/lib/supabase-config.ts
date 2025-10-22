// Configuração do Supabase para a Clínica Belizze
// Este arquivo contém as configurações básicas para conexão com o Supabase

export const SUPABASE_CONFIG = {
  // URL do projeto Supabase
  url: 'https://wgamkjtlvebwquuxxqwu.supabase.co',
  
  // Chave anônima para acesso público
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMxNDgsImV4cCI6MjA3NTczOTE0OH0.5o0-VAfsLfvNOREB-Aujw4CDq3-68X1igSYz10_bYGU',
  
  // Credenciais de administrador (apenas para referência, não use em produção)
  adminCredentials: {
    email: 'admin@belizze.com.br',
    password: 'admin123'
  },
  
  // Buckets de storage
  storageBuckets: {
    procedures: 'procedures',
    beforeAfter: 'before_after',
    professionals: 'professionals',
    testimonials: 'testimonials'
  },
  
  // Funções Edge
  edgeFunctions: {
    getProcedures: 'get-procedures',
    getBeforeAfter: 'get-before-after',
    scheduleAppointment: 'schedule-appointment',
    uploadImage: 'upload-image'
  }
};
