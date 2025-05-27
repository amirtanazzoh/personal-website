import { EmailSchema, GeneralStringSchema, PasswordSchema, PersianPhoneNumberSchema, UserNameSchema } from "@/helpers/zod";
import { z } from "zod";


export const LoginFormSchema = z.object( {
    input: GeneralStringSchema(),
    password: PasswordSchema(),
} );

export type LoginFormType = z.infer<typeof LoginFormSchema>;


export const SignInFormSchema = z.object( {
    first_name: GeneralStringSchema( 'First Name' ),
    last_name: GeneralStringSchema( 'Last Name' ),
    phone_number: PersianPhoneNumberSchema(),
    username: UserNameSchema(),
    email: EmailSchema(),
    password: PasswordSchema(),
    password_confirm: PasswordSchema( 'Password Confirm' ),
} );

export type SignInFormType = z.infer<typeof SignInFormSchema>;

export type SignInApiType = Omit<SignInFormType, 'password_confirm'>;