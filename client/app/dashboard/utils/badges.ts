export type BadgeName = keyof typeof BADGES;

export const BADGES = {
  chronosprout: {
    name: 'Chronosprout',
    description: 'Time traveler in training',
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
    description: 'Discovered time travel secrets during the mysterious evening hour (7 PM - 8 PM)',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronoexplorer.png'
  }
} as const;

