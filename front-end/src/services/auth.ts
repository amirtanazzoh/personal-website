import { SignInApiType } from "@/types/login";
import { GeneralApiRes } from "@/types/api";
import { AxiosInstanceFactory } from "./axios";

const authAxios = new AxiosInstanceFactory( 'auth' );

const instance = authAxios.getInstance();

export async function existUser ( input: string ): Promise<GeneralApiRes<{ user_exists: boolean; }>>
{ return instance.get( 'exist', { params: { input } } ); }

export async function login ( input: string, password: string ): Promise<GeneralApiRes<{ refresh_token: string; }>>
{ return instance.post( 'login', { input, password } ); }

export async function signIn ( data: SignInApiType ): Promise<GeneralApiRes<{ refresh_token: string; }>>
{ return instance.post( 'sign-in', data ); }

export async function refreshToken ( refreshToken: string ): Promise<GeneralApiRes<{ refresh_token: string; }>>
{ return instance.post( 'refresh', { refresh_token: refreshToken } ); }