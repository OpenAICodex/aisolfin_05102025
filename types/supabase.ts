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
        Relationships: [];
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
        Relationships: [];
      };
      admin_settings: {
        Row: {
          id: number;
          prompts: Json | null;
          active_doc_version: number | null;
        };
        Insert: {
          id: number;
          prompts: Json | null;
          active_doc_version: number | null;
        };
        Update: {
          id?: number;
          prompts?: Json | null;
          active_doc_version?: number | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: number;
          version: number;
          title: string | null;
          file_url: string | null;
          is_active: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          version: number;
          title?: string | null;
          file_url?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          version?: number;
          title?: string | null;
          file_url?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      doc_chunks: {
        Row: {
          id: number;
          doc_id: number;
          chunk: string;
          embedding: number[] | null;
          meta: Json | null;
        };
        Insert: {
          id?: number;
          doc_id: number;
          chunk: string;
          embedding?: number[] | null;
          meta?: Json | null;
        };
        Update: {
          id?: number;
          doc_id?: number;
          chunk?: string;
          embedding?: number[] | null;
          meta?: Json | null;
        };
        Relationships: [];
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
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_doc_chunks: {
        Args: {
          query_embedding: number[];
          match_count?: number;
          doc_version?: number | null;
        };
        Returns: Array<{
          id: number;
          doc_id: number;
          chunk: string;
          similarity: number;
        }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
