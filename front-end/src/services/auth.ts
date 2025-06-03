import { GeneralApiRes } from "@/types/api";
import { authAxios } from "./axios";
import { requestWrapper } from "../utils/api";
import { SignInApiType } from "@/types/login";


export async function existUser ( input: string ): Promise<GeneralApiRes<{ user_exists: boolean; }>>
{ return requestWrapper( authAxios.get( 'exist', { params: { input } } ) ); }

export async function login ( input: string, password: string ): Promise<GeneralApiRes<{ access_token_cookie: string; }>>
{
    async function axiosLogin ( input: string, password: string )
    {
        const res = await authAxios.post( 'login', { input, password } );
        let access_token_cookie: undefined | string;

        if ( res.headers[ 'set-cookie' ] ) { access_token_cookie = res.headers[ 'set-cookie' ][ 0 ]; }

        return {
            data: {
                success: true,
                data: { access_token_cookie }
            }
        };
    }

    return requestWrapper( axiosLogin( input, password ) );
}

export async function signIn ( data: SignInApiType ): Promise<GeneralApiRes<{ access_token_cookie: string; }>>
{ return requestWrapper( authAxios.post( 'sign-in', data ) ); }

