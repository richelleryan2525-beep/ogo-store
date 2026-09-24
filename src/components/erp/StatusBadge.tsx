import { STATUS_LABELS, OrderStatus } from '@/lib/utils';

const COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${COLORS[status] || 'bg-gray-100 text-gray-800'}`}>
      {STATUS_LABELS[status as OrderStatus] || status}
    </span>
  );
}
