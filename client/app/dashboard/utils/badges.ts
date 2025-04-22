export type BadgeName = keyof typeof BADGES;

export const BADGES = {
  chronosprout: {
    name: 'Chronosprout',
    description: 'First time traveler - Your journey begins!',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronosprout.png'
  },
  chronoscribe: {
    name: 'Chronoscribe',
    description: 'Master storyteller of time',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronoscribe.png'
  },
  chronolegend: {
    name: 'Chronolegend',
    description: 'Legendary time traveler',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronolegend.png'
  },
  chronoexplorer: {
    name: 'Chronoexplorer',
    description: 'Explorer of multiple timelines',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronoexplorer.png'
  }
} as const; 

