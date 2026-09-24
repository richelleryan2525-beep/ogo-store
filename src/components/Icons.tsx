type P = { size?: number; className?: string };
const base = (size = 22) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true
});

export const MenuIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const SearchIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const HeartIcon = ({ size, className, filled }: P & { filled?: boolean }) => (
  <svg {...base(size)} className={className} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7.5-4.6-9.3-9.5C1.4 7 3.5 4 7 4c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.5 0 5.6 3 4.3 6.5C19.5 15.4 12 20 12 20z" />
  </svg>
);
export const BagIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
);
export const WaIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-4A8 8 0 1 1 20 12z" />
    <path d="M9.2 8.8c-.3.9.2 2.2 1.3 3.3 1.1 1.1 2.4 1.7 3.3 1.4l.9-1-1.9-1-.9.7c-.7-.3-1.3-.9-1.6-1.6l.7-.9-1-1.9z" />
  </svg>
);
export const CloseIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const CheckIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12l5 5 9-10" /></svg>
);
export const TruckIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
);
export const VerifiedIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
);
export const BankIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></svg>
);
export const SparkleIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></svg>
);
export const ChevRight = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M9 6l6 6-6 6" /></svg>
);
export const GemIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 4h12l4 5-10 11L2 9z" /><path d="M2 9h20M9 4l-2 5 5 11 5-11-2-5" /></svg>
);
export const TrashIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
);
export const FilterIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
);
export const PackageIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></svg>
);
export const CopyIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
);
