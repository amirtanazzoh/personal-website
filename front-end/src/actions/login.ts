'use server';

import { login, signIn } from '@/services/auth';
import { LoginFormType, SignInApiType } from '@/types/login';

export async function LoginAction ( loginData: LoginFormType ) { return login( loginData.input, loginData.password ); }

export async function SignInAction ( signInData: SignInApiType ) { return signIn( signInData ); }