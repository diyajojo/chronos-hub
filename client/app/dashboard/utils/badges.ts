export type BadgeName = keyof typeof BADGES;

export const BADGES = {
  chronosprout: {
    name: 'Chronosprout',
    description: 'Time traveler in training',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronosprout.png'
  },
  chronodoppler: {
    name: 'Chronodoppler',
    description: 'A chrono-collision',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronodoppler.png'
  },
  chronoblink: {
    name: 'Chronoblink',
    description: 'Crafted a perfect century of words ',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronoblink.png'
  },
  chronoexplorer: {
    name: 'Chronoexplorer',
    description: 'Night owl explorer of time',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronoexplorer.png'
  },
  chronoprodigy: {
    name: 'Chronoprodigy',
    description: 'Master of time - achieved multiple badges in a single journey',
    imageUrl: 'https://hkrxeroqgguchwhrclsr.supabase.co/storage/v1/object/public/user-badges//chronolegend.png'
  }
} as const;

