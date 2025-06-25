'use client';;
import { Skeleton } from "@/components/ui/skeleton";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useEffect } from "react";

export default function AuthPage ()
{

    const { validateAndRenewToken } = useRefreshToken();

    useEffect( () => { validateAndRenewToken(); } );

    return ( <Skeleton className="h-100 w-full" /> );
}