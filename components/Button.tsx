import type { ElementType, ComponentPropsWithoutRef, PropsWithChildren } from "react";

type PolymorphicAsProp<E extends ElementType> = {
  as?: E;
};

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E>
  & PolymorphicAsProp<E>
>;

type ButtonProps<E extends ElementType = "button"> = PolymorphicProps<E> & {
  color?: 'default' | 'green' | 'red';
  size?: 'small' | 'medium';
};

const Button = <T extends React.ElementType>({ children, color = 'default', size = 'medium', as, ...rest }: ButtonProps<T>) => {
  const Component = as ?? "button";
  const colorClass = {
    default: 'border-[#313248] bg-[#272939] color-[#d2d3e0]',
    green: 'border-green-800 bg-green-900 color-green-100',
    red: 'border-red-800 bg-red-900 color-red-100'
  }
  const sizeClass = {
    small: 'h-6 min-w-[4rem] px-2 text-xs',
    medium: 'h-8 min-w-[6rem] px-6 text-sm'
  }

  return (
    <div className={`flex items-center justify-center border rounded ${colorClass[color]} ${sizeClass[size]}`}>
      <Component {...rest}>{children}</Component>
    </div>
  )
}

export default Button;
