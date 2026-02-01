import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          cost_price: number
          stock_level: number
          low_stock_threshold: number
          last_sold_date: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          price: number
          cost_price: number
          stock_level: number
          low_stock_threshold: number
          last_sold_date?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: number
          cost_price?: number
          stock_level?: number
          low_stock_threshold?: number
          last_sold_date?: string | null
          user_id?: string
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          items: any[]
          total: number
          profit: number
          date: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          items: any[]
          total: number
          profit: number
          date: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          items?: any[]
          total?: number
          profit?: number
          date?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
