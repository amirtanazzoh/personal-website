import { PropsWithChildren } from "react";

export function IF ( { condition, children }: PropsWithChildren<{ condition: boolean; }> )
{
    if ( condition ) { return children; }

    return null;
}