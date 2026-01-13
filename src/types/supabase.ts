// ============================================
// Supabase Database Types
// Generated manually - run `supabase gen types typescript` to auto-generate
// ============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo: string | null;
          status: 'pending' | 'active' | 'suspended';
          created_by: string;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          logo?: string | null;
          status?: 'pending' | 'active' | 'suspended';
          created_by: string;
          updated_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo?: string | null;
          status?: 'pending' | 'active' | 'suspended';
          created_by?: string;
          updated_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          address: string | null;
          city_id: string | null;
          role: 'user' | 'app_admin' | 'organization_admin';
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          address?: string | null;
          city_id?: string | null;
          role?: 'user' | 'app_admin' | 'organization_admin';
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          address?: string | null;
          city_id?: string | null;
          role?: 'user' | 'app_admin' | 'organization_admin';
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
          updated_at?: string;
        };
      };
      cities: {
        Row: {
          id: string;
          name: string;
          state: string;
          latitude: string | null;
          longitude: string | null;
        };
        Insert: {
          id: string;
          name: string;
          state: string;
          latitude?: string | null;
          longitude?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          state?: string;
          latitude?: string | null;
          longitude?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      organization_status: 'pending' | 'active' | 'suspended';
      user_role: 'user' | 'app_admin' | 'organization_admin';
      organization_member_role: 'owner' | 'admin' | 'member';
    };
  };
};

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
