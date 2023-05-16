export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          money: number | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          money?: number | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          money?: number | null;
        };
      };
      results: {
        Row: {
          id: number;
          created_at: string | null;
          user_id: string | null;
          game: string | null;
          result: string | null;
          winAmount: number | null;
          money: number | null;
        };
        Insert: {
          id: number;
          created_at: string | null;
          user_id: string | null;
          game: string | null;
          result: string | null;
          winAmount: number | null;
          money: number | null;
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
  };
}
