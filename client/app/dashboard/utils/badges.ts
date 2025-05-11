export type BadgeName = keyof typeof BADGES;

export const BADGES = {
  chronosprout: {
    name: 'Chronosprout',
    description: 'Time traveler in training',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronosprout.png'
  },
  chronodoppler: {
    name: 'Chronodoppler',
    description: 'A chrono-collision!',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronoscribe.png'
  },
  chronoblink: {
    name: 'Chronoblink',
    description: 'A blink, yet eternal.',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronolegend.png'
  },
  chronoexplorer: {
    name: 'Chronoexplorer',
    description: 'Night owl explorer of time',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronoexplorer.png'
  }
} as const;

