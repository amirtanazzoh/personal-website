'use client';

import FormAlert from "@/components/form/form-alert";
import PasswordInput from "@/components/form/password-input";
import TextInput from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/seprator";
import useRefreshToken from "@/hooks/use-refresh-token";
import { login } from "@/services/auth";
import { LoginFormSchema, LoginFormType } from "@/types/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage ()
{

    const form = useForm<LoginFormType>( { resolver: zodResolver( LoginFormSchema ), defaultValues: { input: '', password: '' } } );
    const [ formStatus, setFormStatus ] = useState<{ message: string, status: undefined | Boolean; }>( { message: '', status: undefined } );
    const { setToken } = useRefreshToken();


    async function onSubmit ( data: LoginFormType )
    {
        const res = await login( data.input, data.password );

        if ( !res.success ) { setFormStatus( { message: res.message, status: false } ); }
        if ( res.success )
        {
            setFormStatus( { message: 'login successfully!', status: true } );
            setToken( res.data.refresh_token );
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>

                <CardDescription>
                    Please enter your username and password to log in to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-3.5">

                        <FormField
                            control={ form.control }
                            name='input'
                            render={ ( { field, fieldState } ) => ( <TextInput field={ field } fieldState={ fieldState } label="Username" /> ) }
                        />

                        <FormField
                            control={ form.control }
                            name='password'
                            render={ ( { field, fieldState } ) => ( <PasswordInput field={ field } fieldState={ fieldState } label="Password" /> ) }
                        />

                        <Button type="submit" className="w-full" > Submit </Button>

                        <FormAlert { ...formStatus } />

                    </form>
                </Form >
            </CardContent>


            <CardFooter>
                <div className="w-full">
                    <Separator />

                    <div className="flex h-5 w-full items-center gap-2 mt-3">

                        <Link href='/auth/sign-in' className="text-blue-600 hover:underline">
                            Create new account
                        </Link>

                        <Separator orientation="vertical" />

                        <Link href='/auth/forget-password' className="text-blue-600 hover:underline">
                            Forgot your password?
                        </Link>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );

}