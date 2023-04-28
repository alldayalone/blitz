import { PropsWithChildren } from "react";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => <main className='max-w-[34rem] mx-auto pt-8 px-4'>{children}</main>;
