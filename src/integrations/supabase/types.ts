export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      backup_links: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          created_at: string | null
          id: string
          license_number: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          license_number: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          license_number?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          comments: string | null
          created_at: string | null
          description: string | null
          driver_id: string | null
          id: string
          meter_end_reading: Json | null
          meter_start_reading: Json | null
          paid_date: string | null
          photos: Json | null
          project_id: string
          purpose_costs: Json | null
          purposes: string[]
          requested_at: string | null
          requested_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          scheduled_date: string | null
          status: string
          status_history: Json | null
          vehicle_id: string | null
          vehicle_used: boolean | null
        }
        Insert: {
          amount: number
          comments?: string | null
          created_at?: string | null
          description?: string | null
          driver_id?: string | null
          id?: string
          meter_end_reading?: Json | null
          meter_start_reading?: Json | null
          paid_date?: string | null
          photos?: Json | null
          project_id: string
          purpose_costs?: Json | null
          purposes: string[]
          requested_at?: string | null
          requested_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheduled_date?: string | null
          status?: string
          status_history?: Json | null
          vehicle_id?: string | null
          vehicle_used?: boolean | null
        }
        Update: {
          amount?: number
          comments?: string | null
          created_at?: string | null
          description?: string | null
          driver_id?: string | null
          id?: string
          meter_end_reading?: Json | null
          meter_start_reading?: Json | null
          paid_date?: string | null
          photos?: Json | null
          project_id?: string
          purpose_costs?: Json | null
          purposes?: string[]
          requested_at?: string | null
          requested_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          scheduled_date?: string | null
          status?: string
          status_history?: Json | null
          vehicle_id?: string | null
          vehicle_used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      progress_entries: {
        Row: {
          correction_request: Json | null
          created_at: string | null
          created_by: string | null
          date: string | null
          distance_completed: number | null
          id: string
          is_locked: boolean | null
          notes: string | null
          payment_requests: string[] | null
          photos: Json | null
          project_id: string
          project_name: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          submitted_by: string | null
          time_spent: number | null
          user_name: string | null
          vehicle_used: Json | null
          workers_present: number | null
        }
        Insert: {
          correction_request?: Json | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          distance_completed?: number | null
          id?: string
          is_locked?: boolean | null
          notes?: string | null
          payment_requests?: string[] | null
          photos?: Json | null
          project_id: string
          project_name?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          time_spent?: number | null
          user_name?: string | null
          vehicle_used?: Json | null
          workers_present?: number | null
        }
        Update: {
          correction_request?: Json | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          distance_completed?: number | null
          id?: string
          is_locked?: boolean | null
          notes?: string | null
          payment_requests?: string[] | null
          photos?: Json | null
          project_id?: string
          project_name?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          time_spent?: number | null
          user_name?: string | null
          vehicle_used?: Json | null
          workers_present?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          num_workers: number
          status: string
          total_distance: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          num_workers?: number
          status?: string
          total_distance?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          num_workers?: number
          status?: string
          total_distance?: number | null
        }
        Relationships: []
      }
      storage_metrics: {
        Row: {
          id: string
          last_updated: string | null
          percentage_used: number
          total_size: number
          used_size: number
        }
        Insert: {
          id?: string
          last_updated?: string | null
          percentage_used?: number
          total_size?: number
          used_size?: number
        }
        Update: {
          id?: string
          last_updated?: string | null
          percentage_used?: number
          total_size?: number
          used_size?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          additional_details: Json | null
          created_at: string | null
          fitness_certificate: Json | null
          id: string
          model: string
          pollution_certificate: Json | null
          registration_number: string
          type: string
        }
        Insert: {
          additional_details?: Json | null
          created_at?: string | null
          fitness_certificate?: Json | null
          id?: string
          model: string
          pollution_certificate?: Json | null
          registration_number: string
          type: string
        }
        Update: {
          additional_details?: Json | null
          created_at?: string | null
          fitness_certificate?: Json | null
          id?: string
          model?: string
          pollution_certificate?: Json | null
          registration_number?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
