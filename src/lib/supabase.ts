import { SupabaseResponse, User, AuthSession } from '../types';

// Configuration Supabase simplifiée pour démonstration client
// Toutes les données sont maintenant statiques pour éviter les appels réseau

export const supabase = {
  auth: {
    getSession: (): Promise<SupabaseResponse<{ session: AuthSession }>> => Promise.resolve({ 
      data: { 
        session: { 
          user: { 
            id: 'demo-user', 
            email: 'demo@autodashboard.com' 
          } 
        } 
      },
      error: null
    }),
    getUser: (): Promise<SupabaseResponse<{ user: User }>> => Promise.resolve({ 
      data: { 
        user: { 
          id: 'demo-user', 
          email: 'demo@autodashboard.com' 
        } 
      },
      error: null
    }),
    signInWithPassword: ({ email }: { email: string; password: string }): Promise<SupabaseResponse<{ user: User }>> => Promise.resolve({ 
      data: { 
        user: { 
          id: 'demo-user', 
          email 
        } 
      }, 
      error: null 
    }),
    signOut: (): Promise<SupabaseResponse<null>> => Promise.resolve({ data: null, error: null }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    }),
    updateUser: (): Promise<SupabaseResponse<null>> => Promise.resolve({ data: null, error: null }),
    resetPassword: (): Promise<SupabaseResponse<null>> => Promise.resolve({ data: null, error: null })
  },
  from: () => ({
    select: (): Promise<SupabaseResponse<any[]>> => Promise.resolve({ data: [], error: null }),
    insert: (): Promise<SupabaseResponse<any[]>> => Promise.resolve({ data: [], error: null }),
    update: (): Promise<SupabaseResponse<any[]>> => Promise.resolve({ data: [], error: null }),
    upsert: (): Promise<SupabaseResponse<any[]>> => Promise.resolve({ data: [], error: null }),
    eq: function() { return this; },
    single: function() { return this; },
    order: function() { return this; }
  })
};