'use client';;
import { Skeleton } from "@/components/ui/skeleton";
import useRefreshToken from "@/hooks/use-refresh-token";
import { useEffect } from "react";

export default function AuthPage ()
{

    const { validateAndRenewToken } = useRefreshToken();

    useEffect( () => { validateAndRenewToken(); } );

    return ( <Skeleton className="h-100 w-full" /> );
}