import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        brown1: 'bg-brown-1 hover:bg-brown-2', 
        brown2: 'bg-brown-2 hover:bg-brown-3 text-white',
        brown3: 'bg-brown-3 hover:bg-brown-4 text-white',
        brown4: 'bg-brown-4 hover:bg-brown-5 text-white',
        brown5: 'bg-brown-5 hover:bg-brown-6 text-white',
        brown6: 'bg-brown-6 hover:opacity-90 text-white',
      },
      size: {
        normal: 'px-8 py-3 text-body-medium',
        large: 'px-15 py-3 text-body-large',
      },
      textColor: {
        white: 'text-white',
        brown: 'text-brown-4', 
      },
    },
    defaultVariants: {
      variant: 'brown2', 
      size: 'normal',
      textColor: 'white',
    },
  }
);

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
>;

export default function Button({
  className,
  variant,
  size,
  textColor, // textColor도 props에서 받아야 적용됩니다!
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      // variant, size, textColor를 모두 buttonVariants에 전달
      className={cn(buttonVariants({ variant, size, textColor }), className)}
      {...props}
    >
      {children}
    </button>
  );
}