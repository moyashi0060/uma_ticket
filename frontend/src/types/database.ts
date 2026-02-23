export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string | null
          event_end_date: string | null
          venue: string | null
          image_url: string | null
          source_url: string
          event_type: 'live' | 'fanmeeting' | 'exhibition' | 'other'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date?: string | null
          event_end_date?: string | null
          venue?: string | null
          image_url?: string | null
          source_url: string
          event_type?: 'live' | 'fanmeeting' | 'exhibition' | 'other'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string | null
          event_end_date?: string | null
          venue?: string | null
          image_url?: string | null
          source_url?: string
          event_type?: 'live' | 'fanmeeting' | 'exhibition' | 'other'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          event_id: string
          platform_id: string
          ticket_url: string
          ticket_type: 'general' | 'premium' | 'lottery' | 'resale'
          sale_start: string | null
          sale_end: string | null
          status: 'upcoming' | 'on_sale' | 'sold_out' | 'ended' | 'unknown'
          price_info: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          platform_id: string
          ticket_url: string
          ticket_type?: 'general' | 'premium' | 'lottery' | 'resale'
          sale_start?: string | null
          sale_end?: string | null
          status?: 'upcoming' | 'on_sale' | 'sold_out' | 'ended' | 'unknown'
          price_info?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          platform_id?: string
          ticket_url?: string
          ticket_type?: 'general' | 'premium' | 'lottery' | 'resale'
          sale_start?: string | null
          sale_end?: string | null
          status?: 'upcoming' | 'on_sale' | 'sold_out' | 'ended' | 'unknown'
          price_info?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ticket_platforms: {
        Row: {
          id: string
          name: string
          display_name: string
          base_url: string
          icon_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          base_url: string
          icon_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          base_url?: string
          icon_url?: string | null
          created_at?: string
        }
      }
      scrape_logs: {
        Row: {
          id: string
          source_name: string
          source_url: string
          status: 'success' | 'error' | 'skipped'
          events_found: number
          events_added: number
          events_updated: number
          error_message: string | null
          started_at: string
          finished_at: string
          created_at: string
        }
        Insert: {
          id?: string
          source_name: string
          source_url: string
          status: 'success' | 'error' | 'skipped'
          events_found?: number
          events_added?: number
          events_updated?: number
          error_message?: string | null
          started_at: string
          finished_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          source_name?: string
          source_url?: string
          status?: 'success' | 'error' | 'skipped'
          events_found?: number
          events_added?: number
          events_updated?: number
          error_message?: string | null
          started_at?: string
          finished_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      active_events_with_tickets: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string | null
          event_end_date: string | null
          venue: string | null
          image_url: string | null
          source_url: string
          event_type: 'live' | 'fanmeeting' | 'exhibition' | 'other'
          created_at: string
          updated_at: string
          tickets: TicketInfo[]
        }
      }
    }
  }
}

export interface TicketInfo {
  ticket_id: string
  platform_name: string
  platform_icon: string | null
  ticket_url: string
  ticket_type: 'general' | 'premium' | 'lottery' | 'resale'
  sale_start: string | null
  sale_end: string | null
  status: 'upcoming' | 'on_sale' | 'sold_out' | 'ended' | 'unknown'
  price_info: string | null
}

// 便利な型エイリアス
export type Event = Database['public']['Tables']['events']['Row']
export type Ticket = Database['public']['Tables']['tickets']['Row']
export type TicketPlatform = Database['public']['Tables']['ticket_platforms']['Row']
export type EventWithTickets = Database['public']['Views']['active_events_with_tickets']['Row']
