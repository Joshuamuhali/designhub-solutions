import { PRODUCTS, PACKAGE_BUNDLES, Product, PackageBundle } from './products';
import { PRODUCT_CATEGORIES } from './products';

export interface ServiceWithSlug extends Product {
  slug: string;
}

export interface BundleWithSlug extends PackageBundle {
  slug: string;
}

// Generate slugs from product IDs (they're already URL-safe)
export const SERVICES_WITH_SLUGS: ServiceWithSlug[] = PRODUCTS.map(product => ({
  ...product,
  slug: product.id // Using existing ID as slug since they're already kebab-case
}));

export const BUNDLES_WITH_SLUGS: BundleWithSlug[] = PACKAGE_BUNDLES.map(bundle => ({
  ...bundle,
  slug: bundle.id // Using existing ID as slug
}));

// Combined lookup for all services and bundles
export const ALL_SERVICES_BY_SLUG: Record<string, ServiceWithSlug | BundleWithSlug> = {};

SERVICES_WITH_SLUGS.forEach(service => {
  ALL_SERVICES_BY_SLUG[service.slug] = service;
});

BUNDLES_WITH_SLUGS.forEach(bundle => {
  ALL_SERVICES_BY_SLUG[bundle.slug] = { ...bundle, isBundle: true };
});

// Helper function to get service by slug
export function getServiceBySlug(slug: string): ServiceWithSlug | BundleWithSlug | null {
  return ALL_SERVICES_BY_SLUG[slug] || null;
}

// Helper function to check if a slug is a bundle
export function isBundleSlug(slug: string): boolean {
  const item = ALL_SERVICES_BY_SLUG[slug];
  return item ? 'isBundle' in item : false;
}

// Get all slugs for static generation
export const ALL_SERVICE_SLUGS = [
  ...SERVICES_WITH_SLUGS.map(s => s.slug),
  ...BUNDLES_WITH_SLUGS.map(b => b.slug)
];
