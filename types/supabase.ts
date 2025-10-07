import { JsonWebKey } from "crypto";



// Generic JSON type for Supabase json/jsonb columns
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Shape you actually store in admin_settings.prompts
export interface PromptSettings {
  compliance?: string;
  businessValue?: string;
  toolsAutomation?: string;
}

/**
 * Partial Supabase typings for the project's database. These interfaces
 * describe tables used by the application. The complete types can be
 * generated using the Supabase CLI but are provided here manually to keep
 * the code self contained.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          role: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          role?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          role?: string | null;
        };
      };
      evaluations: {
        Row: {
          id: string;
          user_id: string;
          input: unknown;
          outputs: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          input: unknown;
          outputs: unknown;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          input?: unknown;
          outputs?: unknown;
          created_at?: string;
        };
      };
      admin_settings: {
        Row: {
          id: number;
          prompts: PromptSettings | null;
          active_doc_version: number | null;
        };
        Insert: {
          id: number;
          prompts: PromptSettings | null;
          active_doc_version: number | null;
        };
        Update: {
          id?: number;
          prompts?: PromptSettings | null;
          active_doc_version?: number | null;
        };
      };
      rate_limits: {
        Row: {
          user_id: string;
          date: string;
          count: number;
        };
        Insert: {
          user_id: string;
          date: string;
          count: number;
        };
        Update: {
          user_id?: string;
          date?: string;
          count?: number;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
