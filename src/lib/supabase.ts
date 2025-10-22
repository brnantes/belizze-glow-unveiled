import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wgamkjtlvebwquuxxqwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMxNDgsImV4cCI6MjA3NTczOTE0OH0.5o0-VAfsLfvNOREB-Aujw4CDq3-68X1igSYz10_bYGU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase_public_auth_token' // Chave única para evitar conflitos
  },
});

// Tipos para os dados do Supabase
export interface Procedure {
  id: string;
  title: string;
  description: string;
  details: string;
  duration: string;
  price: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface BeforeAfterImage {
  id: string;
  procedure_id: string;
  procedure_name: string;
  before_image_url: string;
  after_image_url: string;
  description: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  procedure_id: string;
  rating: number;
  comment: string;
  avatar_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string | null;
  specialties: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  procedure_id: string;
  appointment_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Funções para interagir com o Supabase
export const getProcedures = async (featuredOnly: boolean = false) => {
  const { data, error } = await supabase
    .functions.invoke('get-procedures', {
      body: { featured_only: featuredOnly }
    });
  
  if (error) throw error;
  return data;
};

export const getBeforeAfterImages = async (featuredOnly: boolean = false) => {
  const { data, error } = await supabase
    .functions.invoke('get-before-after', {
      body: { featured_only: featuredOnly }
    });
  
  if (error) throw error;
  return data;
};

export const scheduleAppointment = async (appointment: {
  client_name: string;
  client_email: string;
  client_phone: string;
  procedure_id: string;
  appointment_date: string;
  notes?: string;
}) => {
  const { data, error } = await supabase
    .functions.invoke('schedule-appointment', {
      body: appointment
    });
  
  if (error) throw error;
  return data;
};

export const uploadImage = async (file: File, bucket: string, fileName: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  formData.append('fileName', fileName);

  const { data, error } = await supabase
    .functions.invoke('upload-image', {
      body: formData
    });
  
  if (error) throw error;
  return data;
};
