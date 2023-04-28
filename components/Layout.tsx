import { PropsWithChildren } from "react";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => <main className='min-height-full max-w-[48rem] mx-auto pt-8 px-4'>{children}</main>;
