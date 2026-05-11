import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-xl font-semibold tracking-wide whitespace-nowrap',
    'transition-all duration-200',
    'active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7368]/40 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
  ].join(' '),
  {
    variants: {
      variant: {
        // 보조 버튼 — 따뜻한 베이지 + 테두리
        brown1: 'bg-[#F0E9E1] hover:bg-[#E6DDD3] border border-[#C9B8A8] shadow-sm',
        brown2: 'bg-brown-2 hover:bg-brown-3 shadow-sm',
        brown3: 'bg-brown-3 hover:bg-brown-4 shadow-sm',
        // 주 CTA 버튼 — hover 시 살짝 올라오는 lift 효과
        brown4: [
          'bg-[#8B7368] hover:bg-[#7a6358]',
          'shadow-[0_4px_14px_rgba(139,115,104,0.35)]',
          'hover:shadow-[0_6px_20px_rgba(139,115,104,0.45)]',
          'hover:-translate-y-px',
        ].join(' '),
        brown5: 'bg-brown-5 hover:bg-brown-6 shadow-sm',
        brown6: 'bg-brown-6 hover:opacity-90 shadow-sm',
      },
      size: {
        xs: 'px-3 py-1 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-3 text-body-medium',
        lg: 'px-12 py-4 text-body-large',
        full: 'w-full py-[14px] text-[15px]',
        tag: 'px-4 py-1.5 rounded-full text-sm',
      },
      textColor: {
        white: 'text-white',
        brown: 'text-[#4A3526]',
      },
    },
    defaultVariants: {
      variant: 'brown4',
      size: 'md',
      textColor: 'white',
    },
  },
);

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
>;

export default function Button({
  className,
  variant,
  size,
  textColor,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, textColor }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
