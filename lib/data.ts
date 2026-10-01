import catalogData from '@/data/catalog.json';
import { CatalogData, Product, Category } from '@/types/catalog';

const catalog = catalogData as CatalogData;

export const getConfig = () => catalog.config;
export const getCategories = () => catalog.categories;
export const getProducts = () => catalog.products;
export const getProductBySlug = (slug: string) => catalog.products.find(p => p.slug === slug);
export const getFeaturedProducts = () => catalog.products.filter(p => p.isFeatured && p.status === 'published');
export const getPublishedProducts = () => catalog.products.filter(p => p.status === 'published');
