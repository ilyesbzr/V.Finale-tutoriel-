// Configuration Supabase simplifiée pour démonstration client
// Toutes les données sont maintenant statiques pour éviter les appels réseau

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ 
      data: { 
        session: { 
          user: { 
            id: 'demo-user', 
            email: 'demo@autodashboard.com' 
          } 
        } 
      } 
    }),
    getUser: () => Promise.resolve({ 
      data: { 
        user: { 
          id: 'demo-user', 
          email: 'demo@autodashboard.com' 
        } 
      } 
    }),
    signInWithPassword: ({ email }) => Promise.resolve({ 
      data: { 
        user: { 
          id: 'demo-user', 
          email 
        } 
      }, 
      error: null 
    }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    }),
    updateUser: () => Promise.resolve({ error: null }),
    resetPassword: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    upsert: () => Promise.resolve({ data: [], error: null }),
    eq: function() { return this; },
    single: function() { return this; },
    order: function() { return this; }
  })
};