/**
 * Static category data. Shape mirrors a future Supabase `categories` table:
 * id, slug, name, tagline, description, cover (image url or null), art (placeholder spec).
 */
export const categories = [
  {
    id: 'cat-fuel',
    slug: 'fuel-stations',
    name: 'Fuel Stations',
    tagline: 'Canopies, pumps & forecourts',
    description:
      'Highway stops, retro forecourts and neon-lit night stations — complete with working pump islands and price pylons.',
    cover: null,
    art: { type: 'fuel', accent: '#1f9d55', backdrop: ['#fdf6e3', '#f0dcae'] },
  },
  {
    id: 'cat-food',
    slug: 'fast-food',
    name: 'Fast Food & Diners',
    tagline: 'Drive-thrus, diners & pizzerias',
    description:
      'Burger drive-thrus, fried-chicken joints and corner pizzerias, detailed down to the menu boards and patio umbrellas.',
    cover: null,
    art: { type: 'burger', backdrop: ['#fff4dc', '#f5cf7a'] },
  },
  {
    id: 'cat-garage',
    slug: 'garages',
    name: 'Garages & Workshops',
    tagline: 'Service bays, tyres & car washes',
    description:
      'Roller doors, tyre stacks, oil drums and grease-stained floors — workshops that look like they just closed for the night.',
    cover: null,
    art: { type: 'garage', backdrop: ['#eef3f4', '#c9d9dc'] },
  },
  {
    id: 'cat-shops',
    slug: 'storefronts',
    name: 'Shops & Storefronts',
    tagline: 'Groceries, cafés & high streets',
    description:
      'Striped awnings, fruit crates and hand-lettered signage. Build a whole high street, one storefront at a time.',
    cover: null,
    art: { type: 'shop', floors: 2, backdrop: ['#f3f6ee', '#d2dfc4'] },
  },
  {
    id: 'cat-civic',
    slug: 'landmarks',
    name: 'Civic & Landmarks',
    tagline: 'Fire stations, police & more',
    description:
      'The buildings every model town needs — fire stations with rolling engines, police posts and civic landmarks.',
    cover: null,
    art: { type: 'civic', backdrop: ['#fdf0ea', '#efc6b3'] },
  },
]
