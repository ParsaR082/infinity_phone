import { PRODUCTS_DATA, getProductBySlug } from '../../../lib/products';
import ProductDetailClient from '../../../components/ProductDetailClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return PRODUCTS_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug) || PRODUCTS_DATA[0];
  if (!product) {
    return {
      title: 'محصول پیدا نشد | اینفینیتی فون',
    };
  }

  return {
    title: `${product.name} | اینفینیتی فون (Infinity Phone)`,
    description: product.shortDesc,
    openGraph: {
      title: `${product.name} | اینفینیتی فون`,
      description: product.tagline,
      images: [product.images[0]],
    },
  };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug) || PRODUCTS_DATA.find(p => p.slug === 'apple-iphone-16-pro-max');

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

