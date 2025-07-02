'use client';

import { refreshToken } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * @description hook for managing refresh token
 * @returns { setRefreshToken, getRefreshToken, renewRefreshToken }
 */
export default function useRefreshToken ()
{

    const router = useRouter();
    const searchParams = useSearchParams();


    const redirectTo = searchParams.get( 'redirectTo' ) || '/';
    const redirectOnFail = '/auth/login?redirectTo=' + redirectTo;

    /**
     * @description set refresh token to local storage
     * @param token 
     */
    const setToken = ( token: string ) => { window.localStorage.setItem( 'rf_tk', token ); };

    /**
     * @description get refresh token from local storage
     * @returns string | null
     */
    const getToken = () => window.localStorage.getItem( 'rf_tk' );

    /**
     * @description renew the refresh token and redirect to the given page on success otherwise redirect to the fail page
     * @param redirectOnSuccess 
     * @param redirectOnFail 
     * @return Promise<void>
     */
    const validateAndRenewToken = async () =>
    {
        const token = getToken();

        if ( !token ) { router.replace( redirectOnFail ); return; };

        const request = await refreshToken( token );

        if ( request.success )
        {
            setToken( request.data.refresh_token );
            router.replace( redirectTo );

            return;
        }

        setToken( '' );
        router.replace( redirectOnFail );
    };

    return { setToken, getToken, validateAndRenewToken };
}