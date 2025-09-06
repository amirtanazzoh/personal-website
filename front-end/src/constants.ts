import { checkExistVariable, isClient, isServer } from "./utils/basic";

export const SERVER_API_BASE_URL = process.env.BACKEND_URL;

export const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const API_TIMEOUT_IN_MILLISECOND = 5000;

export const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

export const API_OWNER = process.env.NEXT_PUBLIC_API_OWNER;

export const NODE_ENV = process.env.NODE_ENV;


if ( isServer() )
{
    checkExistVariable( SERVER_API_BASE_URL, 'SERVER_API_BASE_URL' );
    checkExistVariable( API_SECRET, 'API_SECRET' );
    checkExistVariable( API_OWNER, 'API_OWNER' );
}

if ( isClient() )
{
    checkExistVariable( CLIENT_API_BASE_URL, 'CLIENT_API_BASE_URL' );
    checkExistVariable( API_SECRET, 'API_SECRET' );
    checkExistVariable( API_OWNER, 'API_OWNER' );
}
