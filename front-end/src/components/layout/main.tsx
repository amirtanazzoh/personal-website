import { cn } from "@/helpers/shadcn";
import { HTMLAttributes, PropsWithChildren } from "react";


export default function Main ( { children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement>> )
{
    return (
        <main className={ cn( 'w-screen overflow-x-hidden', className ) } { ...props }>
            { children }
        </main>
    );
}