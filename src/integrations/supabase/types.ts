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
          cognitive_style: Json | null
          created_at: string
          emotional_intelligence_score: number | null
          growth_areas: Json | null
          id: string
          inhibitors: Json | null
          intelligence: Json | null
          intelligence_score: number | null
          learning_pathways: Json | null
          motivators: Json | null
          overview: string | null
          relationship_patterns: Json | null
          result: Json
          roadmap: string | null
          traits: Json | null
          user_id: string
          value_system: Json | null
          weaknesses: Json | null
        }
        Insert: {
          assessment_id: string
          career_suggestions?: Json | null
          cognitive_style?: Json | null
          created_at?: string
          emotional_intelligence_score?: number | null
          growth_areas?: Json | null
          id: string
          inhibitors?: Json | null
          intelligence?: Json | null
          intelligence_score?: number | null
          learning_pathways?: Json | null
          motivators?: Json | null
          overview?: string | null
          relationship_patterns?: Json | null
          result: Json
          roadmap?: string | null
          traits?: Json | null
          user_id: string
          value_system?: Json | null
          weaknesses?: Json | null
        }
        Update: {
          assessment_id?: string
          career_suggestions?: Json | null
          cognitive_style?: Json | null
          created_at?: string
          emotional_intelligence_score?: number | null
          growth_areas?: Json | null
          id?: string
          inhibitors?: Json | null
          intelligence?: Json | null
          intelligence_score?: number | null
          learning_pathways?: Json | null
          motivators?: Json | null
          overview?: string | null
          relationship_patterns?: Json | null
          result?: Json
          roadmap?: string | null
          traits?: Json | null
          user_id?: string
          value_system?: Json | null
          weaknesses?: Json | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
