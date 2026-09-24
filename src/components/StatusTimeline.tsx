'use client';

import { motion } from 'framer-motion';
import { CheckIcon } from './Icons';
import { ORDER_STATUSES, STATUS_LABELS, OrderStatus } from '@/lib/utils';

const FLOW: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function StatusTimeline({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 font-semibold text-danger">
        This order was cancelled.
      </div>
    );
  }
  const idx = FLOW.indexOf(status as OrderStatus);

  return (
    <ol className="grid gap-0">
      {FLOW.map((s, i) => {
        const done = i <= idx;
        const isLast = i === FLOW.length - 1;
        return (
          <li key={s} className="relative flex gap-3.5 pb-6 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5"
                style={{ background: i < idx ? 'var(--gold)' : 'var(--line)' }}
              />
            )}
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="grid h-8 w-8 flex-none place-items-center rounded-full"
              style={{ background: done ? 'var(--gold)' : 'var(--surface-3)', color: done ? '#fff' : 'var(--muted)' }}
            >
              {done ? <CheckIcon size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
            </motion.span>
            <div className="pt-1">
              <b className={done ? '' : 'text-muted'}>{STATUS_LABELS[s]}</b>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { ORDER_STATUSES };
