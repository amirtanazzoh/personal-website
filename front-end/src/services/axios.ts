import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if ( !BASE_URL ) { throw new Error( 'api base url is undefined!' ); }

//Axios instances
export const baseAppAxios = axios.create( {
    baseURL: BASE_URL,
    timeout: 1000 * 5, //5 second
    withCredentials: true,
    headers: {
        'x-sec-app': process.env.NEXT_PUBLIC_API_SECRET,
        'x-owner': process.env.NEXT_PUBLIC_API_OWNER
    }
} );


function addGlobalInterceptors ( ...instances: AxiosInstance[] )
{
    instances.forEach( ( instance ) =>
    {
        //add access_token to cookies
        instance.interceptors.request.use( async ( req ) =>
        {
            const access_token = ( await cookies() ).get( 'access_token' )?.value;

            if ( access_token ) { req.headers[ 'Cookie' ] = `access_token=${ access_token }`; }

            return req;
        } );

    } );
}


export const authAxios = baseAppAxios.create( {
    baseURL: BASE_URL + '/auth'
} );

export const userAxios = baseAppAxios.create( {
    baseURL: BASE_URL + '/users',
} );

addGlobalInterceptors( userAxios, authAxios );

