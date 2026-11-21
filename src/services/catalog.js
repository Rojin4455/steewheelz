/**
 * Catalogue data access layer.
 *
 * Every page/component reads products through these async functions only.
 * Today they resolve static data; to move to Supabase, replace the bodies
 * (see the commented examples) — the function signatures stay the same.
 *
 *   import { supabase } from './supabaseClient'
 *   const { data } = await supabase.from('products').select('*, product_images(*)')
 */
import { products as PRODUCTS } from '../data/products'
import { categories as CATEGORIES } from '../data/categories'
import { placeholderGallery, placeholderImage } from '../lib/placeholderArt'

/* Normalise a raw record (static or DB row) into the shape the UI expects. */
const imageCache = new Map()
function normaliseProduct(raw) {
  let images = raw.images
  if (!images?.length) {
    if (!imageCache.has(raw.id)) imageCache.set(raw.id, placeholderGallery(raw.art))
    images = imageCache.get(raw.id)
  }
  return { ...raw, images, cover: images[0].src }
}

function normaliseCategory(raw) {
  return { ...raw, cover: raw.cover ?? placeholderImage(raw.art, 'studio') }
}

const ALL = PRODUCTS.map(normaliseProduct)
const CATS = CATEGORIES.map(normaliseCategory)

export async function getProducts({ category, search, sort = 'featured', filter } = {}) {
  // Supabase: supabase.from('products').select('*').eq('category', category).ilike('name', `%${search}%`)
  let list = [...ALL]
  if (category) list = list.filter((p) => p.category === category)
  if (filter === 'new') list = list.filter((p) => p.isNew)
  if (filter === 'featured') list = list.filter((p) => p.featured)
  if (search) {
    const q = search.trim().toLowerCase()
    list = list.filter((p) => [p.name, p.shortDescription, p.category, p.sku].join(' ').toLowerCase().includes(q))
  }
  const sorters = {
    featured: (a, b) => Number(b.featured) - Number(a.featured),
    newest: (a, b) => Number(b.isNew) - Number(a.isNew),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
  }
  return list.sort(sorters[sort] ?? sorters.featured)
}

export async function getProductBySlug(slug) {
  // Supabase: supabase.from('products').select('*').eq('slug', slug).single()
  return ALL.find((p) => p.slug === slug) ?? null
}

export async function getRelatedProducts(product, limit = 4) {
  const same = ALL.filter((p) => p.category === product.category && p.id !== product.id)
  const others = ALL.filter((p) => p.category !== product.category && p.featured)
  return [...same, ...others].slice(0, limit)
}

export async function getCategories() {
  // Supabase: supabase.from('categories').select('*').order('position')
  return CATS.map((c) => ({ ...c, count: ALL.filter((p) => p.category === c.slug).length }))
}

export async function getCategoryBySlug(slug) {
  return CATS.find((c) => c.slug === slug) ?? null
}
