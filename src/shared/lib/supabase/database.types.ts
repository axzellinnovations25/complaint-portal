export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          role: Database['public']['Enums']['user_role']
          department_id: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: Database['public']['Enums']['user_role']
          department_id?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      complaints: {
        Row: {
          id: string
          reference_no: string
          title: string
          description: string
          status: string
          priority: string
          category_id: string | null
          location_id: string | null
          department_id: string | null
          assigned_officer_id: string | null
          contact_number: string | null
          public_status_note: string | null
          internal_note: string | null
          submitted_at: string
          resolved_at: string | null
          closed_at: string | null
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
          location_id?: string | null
          department_id?: string | null
          assigned_officer_id?: string | null
          contact_number?: string | null
          public_status_note?: string | null
          internal_note?: string | null
          submitted_at?: string
          resolved_at?: string | null
          closed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['complaints']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      complaint_status:
        | 'submitted'
        | 'under_review'
        | 'accepted'
        | 'rejected'
        | 'assigned'
        | 'in_progress'
        | 'on_hold'
        | 'resolved'
        | 'reopened'
        | 'closed'
      user_role:
        | 'super_admin'
        | 'main_admin'
        | 'management_viewer'
        | 'department_head'
        | 'officer'
        | 'field_officer'
        | 'content_admin'
        | 'knowledge_admin'
        | 'viewer'
    }
    CompositeTypes: Record<string, never>
  }
}
