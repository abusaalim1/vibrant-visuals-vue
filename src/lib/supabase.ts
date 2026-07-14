import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tjdrtxbbcsbajrvvqkcf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqZHJ0eGJiY3NiYWpydnZxa2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMzU2ODAsImV4cCI6MjA5ODYxMTY4MH0.pGE2KO7mHkhbggXLkksQlmxAPePKEMHywQBk9PhRDos";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export type UserProfile = {
  id: number;
  auth_id: string | null;
  email: string | null;
  name: string | null;
  full_name: string | null;
  age: number | null;
  partner_name_label: string | null;
  relationship_start_date: string | null;
  met_story: string | null;
  interests: string | null;
  profile_pic_url: string | null;
  created_at: string;
};

export type Couple = {
  id: number;
  created_at: string;
  invite_code: string;
  user1_id: string;
  user2_id: string | null;
  connected_at: string | null;
};

export type Notification = {
  id: number;
  created_at: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  related_user_name: string | null;
};

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
