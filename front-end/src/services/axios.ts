import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if ( !BASE_URL ) { throw new Error( 'api base url is undefined!' ); }

//Axios instances
export const baseAppAxios = axios.create( {
    baseURL: BASE_URL,
    timeout: 1000 * 5, //5 second
    headers: {
        'x-sec-app': process.env.NEXT_PUBLIC_API_SECRET,
        'x-owner': process.env.NEXT_PUBLIC_API_OWNER
    }
} );


export const authAxios = baseAppAxios.create( {
    baseURL: BASE_URL + '/auth'
} );
