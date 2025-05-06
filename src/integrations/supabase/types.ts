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
      activities: {
        Row: {
          benefits: string | null
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          points: number
          steps: Json | null
          title: string
          user_id: string
        }
        Insert: {
          benefits?: string | null
          category: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          steps?: Json | null
          title: string
          user_id: string
        }
        Update: {
          benefits?: string | null
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points?: number
          steps?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      analyses: {
        Row: {
          assessment_id: string
          career_suggestions: Json | null
          cognitive_patterning: Json | null
          cognitive_style: Json | null
          core_traits: Json | null
          created_at: string
          emotional_architecture: Json | null
          emotional_intelligence_score: number | null
          growth_areas: Json | null
          growth_potential: Json | null
          id: string
          inhibitors: Json | null
          intelligence: Json | null
          intelligence_score: number | null
          interpersonal_dynamics: Json | null
          learning_pathways: Json | null
          motivators: Json | null
          overview: string | null
          relationship_patterns: Json | null
          response_patterns: Json | null
          result: Json
          roadmap: string | null
          shadow_aspects: Json | null
          traits: Json | null
          user_id: string
          value_system: Json | null
          weaknesses: Json | null
        }
        Insert: {
          assessment_id: string
          career_suggestions?: Json | null
          cognitive_patterning?: Json | null
          cognitive_style?: Json | null
          core_traits?: Json | null
          created_at?: string
          emotional_architecture?: Json | null
          emotional_intelligence_score?: number | null
          growth_areas?: Json | null
          growth_potential?: Json | null
          id: string
          inhibitors?: Json | null
          intelligence?: Json | null
          intelligence_score?: number | null
          interpersonal_dynamics?: Json | null
          learning_pathways?: Json | null
          motivators?: Json | null
          overview?: string | null
          relationship_patterns?: Json | null
          response_patterns?: Json | null
          result: Json
          roadmap?: string | null
          shadow_aspects?: Json | null
          traits?: Json | null
          user_id: string
          value_system?: Json | null
          weaknesses?: Json | null
        }
        Update: {
          assessment_id?: string
          career_suggestions?: Json | null
          cognitive_patterning?: Json | null
          cognitive_style?: Json | null
          core_traits?: Json | null
          created_at?: string
          emotional_architecture?: Json | null
          emotional_intelligence_score?: number | null
          growth_areas?: Json | null
          growth_potential?: Json | null
          id?: string
          inhibitors?: Json | null
          intelligence?: Json | null
          intelligence_score?: number | null
          interpersonal_dynamics?: Json | null
          learning_pathways?: Json | null
          motivators?: Json | null
          overview?: string | null
          relationship_patterns?: Json | null
          response_patterns?: Json | null
          result?: Json
          roadmap?: string | null
          shadow_aspects?: Json | null
          traits?: Json | null
          user_id?: string
          value_system?: Json | null
          weaknesses?: Json | null
        }
        Relationships: []
      }
      assessment_credits: {
        Row: {
          bonus_credits: number
          bundle_purchases: number
          created_at: string
          credits_remaining: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bonus_credits?: number
          bundle_purchases?: number
          created_at?: string
          credits_remaining?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bonus_credits?: number
          bundle_purchases?: number
          created_at?: string
          credits_remaining?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assessment_purchases: {
        Row: {
          amount: number
          credits: number
          id: string
          payment_session_id: string | null
          purchase_date: string
          purchase_type: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          credits?: number
          id?: string
          payment_session_id?: string | null
          purchase_date?: string
          purchase_type?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          credits?: number
          id?: string
          payment_session_id?: string | null
          purchase_date?: string
          purchase_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          completed_at: string
          id: string
          responses: Json
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          responses: Json
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          responses?: Json
          user_id?: string
        }
        Relationships: []
      }
      big_me_analyses: {
        Row: {
          analysis_report: Json
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          analysis_report: Json
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          analysis_report?: Json
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      concise_analyses: {
        Row: {
          analysis_data: Json
          assessment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          analysis_data: Json
          assessment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          assessment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concise_analyses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "concise_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      concise_assessments: {
        Row: {
          created_at: string
          id: string
          responses: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          responses: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          responses?: Json
          user_id?: string
        }
        Relationships: []
      }
      deep_analyses: {
        Row: {
          analysis_data: Json
          assessment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          analysis_data: Json
          assessment_id: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Update: {
          analysis_data?: Json
          assessment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_e2e_test_analysis: {
        Args: {
          analysis_id: string
          analysis_title: string
          analysis_overview: string
        }
        Returns: string
      }
      get_analysis_by_id: {
        Args: { analysis_id: string }
        Returns: Json
      }
      get_comprehensive_analysis_by_id: {
        Args: { analysis_id: string }
        Returns: Json
      }
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
