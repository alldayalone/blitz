import type { ElementType, ComponentPropsWithoutRef, PropsWithChildren } from "react";
import styles from './Button.module.css';

type PolymorphicAsProp<E extends ElementType> = {
  as?: E;
};

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E>
  & PolymorphicAsProp<E>
>;

const colorClass = {
  default: 'border-[#313248] bg-[#272939] color-[#d2d3e0]',
  green: 'border-green-800 bg-green-900 color-green-100',
  red: 'border-red-800 bg-red-900 color-red-100',
  fancy: styles.fancyBtn
}

const sizeClass = {
  small: 'h-6 min-w-[4rem] px-2 text-xs',
  medium: 'h-8 min-w-[8rem] px-6 text-sm',
  large: 'h-12 min-w-[12rem] px-10 text-lg'
}

type ButtonProps<E extends ElementType = "button"> = PolymorphicProps<E> & {
  color?: keyof typeof colorClass;
  size?: keyof typeof sizeClass;
  className?: string;
};

const Button = <T extends React.ElementType>({ children, as, color = 'default', size = 'medium', className = '', ...rest }: ButtonProps<T>) => {
  const Component = as ?? "button";

  return (
    <Component className={`flex items-center justify-center border rounded w-full xs:w-auto ${colorClass[color]} ${sizeClass[size]} ${className}`} {...rest}>{children}</Component>
  )
}

export default Button;
