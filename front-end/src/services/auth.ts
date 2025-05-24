import { authAxios } from "./axios";
import { requestWrapper } from "./utils";


export async function existUser ( input: string )
{ return requestWrapper( authAxios.get( 'exist', { params: { input } } ) ); }