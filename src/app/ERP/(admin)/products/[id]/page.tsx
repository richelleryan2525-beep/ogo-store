import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { serialize } from '@/lib/utils';
import { ProductDTO } from '@/lib/types';
import ProductForm from '@/components/erp/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await connectDB();
  const doc = await Product.findById(params.id).lean();
  if (!doc) notFound();
  const product = serialize(doc) as unknown as ProductDTO;

  return (
    <div>
      <h1 className="mb-5 font-serif text-2xl font-medium">Edit product</h1>
      <ProductForm product={product} />
    </div>
  );
}
