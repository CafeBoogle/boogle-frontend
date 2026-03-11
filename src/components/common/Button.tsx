import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // #D9D4CF (미선택 상태) 를 brown1에 할당
        brown1: 'bg-[#D9D4CF]  hover:bg-[#c4beb8]',
        brown2: 'bg-brown-2 hover:bg-brown-3 ',
        brown3: 'bg-brown-3 hover:bg-brown-4 ',
        // #8B7368 (선택 상태) 를 brown4에 할당
        brown4: 'bg-[#8B7368] hover:opacity-90 ',
        brown5: 'bg-brown-5 hover:bg-brown-6 ',
        brown6: 'bg-brown-6 hover:opacity-90',
      },
      size: {
        xs: 'px-3 py-1 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-3 text-body-medium',
        lg: 'px-12 py-4 text-body-large',
        full: 'w-full py-4 text-body-large',
        tag: 'px-4 py-2 rounded-full text-sm',
      },
      textColor: {
        white: 'text-white',
        brown: 'text-brown-4',
      },
    },
    defaultVariants: {
      variant: 'brown2',
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
