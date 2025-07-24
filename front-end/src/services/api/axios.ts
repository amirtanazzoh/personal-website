import { API_OWNER, API_SECRET, API_TIMEOUT_IN_MILLISECOND, CLIENT_API_BASE_URL, SERVER_API_BASE_URL } from '@/constants';
import { isClient, isServer } from '@/utils/basic';
import axios, { AxiosInstance } from 'axios';

export class AxiosInstanceFactory
{
    private instance: AxiosInstance;
    private domain: string;
    private prefix: string;
    private path: string;

    constructor ( path: string, prefix?: string )
    {
        this.instance = axios.create();

        this.domain = ( isServer() ? SERVER_API_BASE_URL : CLIENT_API_BASE_URL ) ?? '';

        this.prefix = prefix ?? 'api/v1';

        this.path = path;

        this.addDefaults();

        //Add General Interceptors

        this.addInterceptor( this.addCookiesForServerRequests );
        this.addInterceptor( this.RefreshToken.bind( this ) );
        this.addInterceptor( this.sendErrorLogs );
        this.addInterceptor( this.responseWrapper );


    }


    private addDefaults ()
    {
        this.instance.defaults.baseURL = `${ this.domain }/${ this.prefix }/${ this.path }`;

        this.instance.defaults.timeout = API_TIMEOUT_IN_MILLISECOND;

        this.instance.defaults.headers.Accept = 'application/json';

        this.instance.defaults.withCredentials = true;

        this.instance.defaults.headers[ 'x-sec-app' ] = API_SECRET || '';

        this.instance.defaults.headers[ 'x-owner' ] = API_OWNER || '';
    }

    /**
     * for developing purpose
     * @param instance 
     */
    private logRequests ( instance: AxiosInstance )
    {
        instance.interceptors.request.use( ( config ) =>
        {
            console.log( 'config: ', config );
            return config;
        } );

        instance.interceptors.response.use(
            ( res ) =>
            {
                console.log( 'res: ', res );
                return res;
            },
            ( err ) =>
            {
                console.log( 'err: ', err );
                throw err;
            }
        );
    }

    /**
     * @description add cookies to request in server its role equals to {withCredentials: true}
     * @param instance
     */
    private addCookiesForServerRequests ( instance: AxiosInstance )
    {

        instance.interceptors.request.use( ( config ) =>
        {
            if ( isClient() || config.headers._retry ) return config;

            // @ts-ignore
            config.headers.Cookie = globalThis?.__incrementalCache?.requestHeaders?.cookie || '';

            return config;
        } );
    }

    /**
     * @description add access token interceptor to request when it is expired or undefined
     * @param instance
     */
    private RefreshToken ( instance: AxiosInstance )
    {
        const refreshTokenAddress = `${ this.domain }/${ this.prefix }/auth/refresh`;
        const logoutAddress = `${ this.domain }/${ this.prefix }/auth/logout`;

        instance.interceptors.response.use(
            ( response ) => response,
            async ( error ) =>
            {
                const { response, config: originalRequest } = error;

                if ( response?.status !== 401 || originalRequest.headers._retry ) throw error;


                originalRequest.headers._retry = true;

                try
                {
                    const response = await axios.post( refreshTokenAddress, {},
                        {
                            headers: {
                                // @ts-ignore
                                Cookie: globalThis?.__incrementalCache?.requestHeaders?.cookie,
                            },
                            withCredentials: true,
                        },
                    );

                    const cookies = response.headers[ 'set-cookie' ];

                    //Create cookie string from set-cookie header
                    let cookieString = '';
                    cookies?.forEach( ( cookie ) =>
                    {
                        const [ name, value ] = cookie.split( '=' );
                        cookieString += `${ name }=${ value.replace( '; Max-Age', '' ) }; `;
                    } );

                    originalRequest.headers.Cookie = cookieString;

                    return instance( originalRequest );

                }
                catch ( refreshError ) { await axios.post( logoutAddress ); throw refreshError; }



            },
        );
    }

    /**
     * @description add error interceptor for send log to server
     * @param instance 
     */
    private sendErrorLogs ( instance: AxiosInstance )
    {
        instance.interceptors.response.use(
            ( response ) => response,
            async ( error ) =>
            {

                const method = error?.config?.method?.toUpperCase() || 'UNKNOWN METHOD';

                const url = error?.config?.baseURL + '/' + error?.config?.url || 'UNKNOWN URL';

                let msg = error.response?.data.message;
                if ( Array.isArray( msg ) ) { msg = msg.join( ', \n' ); }

                const status = error.response?.data.statusCode || 'UNKNOWN STATUS CODE';

                const message = `Request failed: ${ method } ${ url } ${ status } - ${ msg }`;

                const baseUrl = isServer() ? 'http://localhost:3000' : CLIENT_API_BASE_URL;

                try { await axios.post( `${ baseUrl }/api/error-logs`, { message } ); }

                catch ( e ) { console.warn( 'Failed to send log to server:', e ); }

                throw error;

            }
        );
    }

    /**
     * @description wrap response to GeneralApiRes
     * @param instance 
     */
    private responseWrapper ( instance: AxiosInstance )
    {
        instance.interceptors.response.use(
            ( response ) => response.data,
            ( error ) =>
            {
                return {
                    success: false,
                    message: error.response?.data?.message || 'Unknown error occurred',
                    statusCode: error.response?.status || 500,
                };
            }
        );
    }

    public getInstance () { return this.instance; }

    public addInterceptor ( interceptor: ( instance: AxiosInstance ) => void ) { interceptor( this.instance ); }
}


export const axiosGeneralInstance = new AxiosInstanceFactory( '' ).getInstance();