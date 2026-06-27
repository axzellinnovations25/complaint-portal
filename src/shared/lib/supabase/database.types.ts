export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      complaints: {
        Row: {
          id: string
          reference_no: string
          title: string
          description: string
          status: string
          priority: string
          category_id: string | null
          department_id: string | null
          assigned_officer_id: string | null
          contact_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_no: string
          title: string
          description: string
          status?: string
          priority?: string
          category_id?: string | null
          department_id?: string | null
          assigned_officer_id?: string | null
          contact_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['complaints']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
