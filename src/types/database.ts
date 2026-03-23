export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          default_currency: 'RUB' | 'USD' | 'EUR';
          monthly_budget: number | null;
          theme: 'light' | 'dark' | 'system';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          default_currency?: 'RUB' | 'USD' | 'EUR';
          monthly_budget?: number | null;
          theme?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          default_currency?: 'RUB' | 'USD' | 'EUR';
          monthly_budget?: number | null;
          theme?: 'light' | 'dark' | 'system';
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          price: number;
          currency: 'RUB' | 'USD' | 'EUR';
          frequency: 'monthly' | 'yearly' | 'weekly' | 'custom';
          custom_frequency_days: number | null;
          category: string;
          next_payment_date: string;
          start_date: string;
          notes: string | null;
          color: string | null;
          is_active: boolean;
          reminder_days_before: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          price: number;
          currency?: 'RUB' | 'USD' | 'EUR';
          frequency: 'monthly' | 'yearly' | 'weekly' | 'custom';
          custom_frequency_days?: number | null;
          category?: string;
          next_payment_date: string;
          start_date: string;
          notes?: string | null;
          color?: string | null;
          is_active?: boolean;
          reminder_days_before?: number | null;
        };
        Update: {
          name?: string;
          price?: number;
          currency?: 'RUB' | 'USD' | 'EUR';
          frequency?: 'monthly' | 'yearly' | 'weekly' | 'custom';
          custom_frequency_days?: number | null;
          category?: string;
          next_payment_date?: string;
          start_date?: string;
          notes?: string | null;
          color?: string | null;
          is_active?: boolean;
          reminder_days_before?: number | null;
        };
      };
    };
  };
};
