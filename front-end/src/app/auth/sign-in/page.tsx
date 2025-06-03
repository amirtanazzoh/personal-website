'use client';;
import { SignInAction } from "@/actions/login";
import FormAlert from "@/components/form/form-alert";
import PasswordInput from "@/components/form/password-input";
import PhoneNumberInput from "@/components/form/phone-number-input";
import TextInput from "@/components/form/text-input";
import UsernameInput from "@/components/form/username-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/seprator";
import { SignInFormType, SignInFormSchema } from "@/types/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const defaultValues: SignInFormType = {
    first_name: '',
    last_name: '',
    phone_number: '',
    username: '',
    email: '',
    password: '',
    password_confirm: '',
};

export default function SignInPage ()
{

    const form = useForm<SignInFormType>( { resolver: zodResolver( SignInFormSchema ), defaultValues } );
    const [ formStatus, setFormStatus ] = useState<{ message: string, status: undefined | Boolean; }>( { message: '', status: undefined } );

    async function onSubmit ( data: SignInFormType )
    {

        const { phone_number, password_confirm, ...restData } = data;

        if ( password_confirm !== restData.password ) { setFormStatus( { message: 'Passwords are not match!', status: false } ); return; }


        const res = await SignInAction( {
            phone_number: '0' + phone_number,
            ...restData,
        } );

        if ( !res.success ) { setFormStatus( { message: res.message, status: false } ); }
        if ( res.success ) { setFormStatus( { message: 'login successfully!', status: true } ); }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign In</CardTitle>

                <CardDescription>
                    If the entered character is invalid, it will not be displayed.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-3.5">

                        <div className="flex gap-2 [&>*]:flex-1">
                            <FormField
                                control={ form.control }
                                name='first_name'
                                render={ ( { field, fieldState } ) => ( <TextInput field={ field } fieldState={ fieldState } label="First Name" /> ) } />

                            <FormField
                                control={ form.control }
                                name='last_name'
                                render={ ( { field, fieldState } ) => ( <TextInput field={ field } fieldState={ fieldState } label="Last Name" /> ) } />
                        </div>


                        <FormField
                            control={ form.control }
                            name='phone_number'
                            render={ ( { field, fieldState } ) => ( <PhoneNumberInput field={ field } fieldState={ fieldState } label="Phone Number" /> ) } />

                        <div className="flex gap-2 [&>*]:flex-1">
                            <FormField
                                control={ form.control }
                                name="username"
                                render={ ( { field, fieldState } ) => <UsernameInput field={ field } fieldState={ fieldState } label="Username" /> } />

                            <FormField
                                control={ form.control }
                                name='email'
                                render={ ( { field, fieldState } ) => ( <TextInput field={ field } fieldState={ fieldState } type="email" label="Email" /> ) } />
                        </div>

                        <div className="flex gap-2 [&>*]:flex-1">
                            <FormField
                                control={ form.control }
                                name='password'
                                render={ ( { field, fieldState } ) => ( <PasswordInput field={ field } fieldState={ fieldState } label="Password" /> ) } />

                            <FormField
                                control={ form.control }
                                name='password_confirm'
                                render={ ( { field, fieldState } ) => ( <PasswordInput field={ field } fieldState={ fieldState } label="Password Confirm" /> ) } />
                        </div>

                        <Button type="submit" className="w-full" > Sign In </Button>

                        <FormAlert { ...formStatus } />

                    </form>
                </Form>
            </CardContent>

            <CardFooter>
                <div className="w-full">
                    <Separator />

                    <div className="flex h-5 w-full items-center gap-2 mt-3">

                        <Link href='/auth/login' className="text-blue-600 hover:underline">
                            You have an account?
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