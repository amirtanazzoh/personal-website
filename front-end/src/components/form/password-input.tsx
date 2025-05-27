import { FormInputInnerProps } from "@/types/fields";
import { FormControl, FormDescription, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordInput ( { field, fieldState, label, placeholder }: FormInputInnerProps )
{
    const [ showPassword, setShowPassword ] = useState( false );

    return (
        <FormItem>
            <FormLabel>{ label }</FormLabel>
            <div className="flex gap-2">
                <FormControl>
                    <Input type={ showPassword ? 'text' : 'password' } placeholder={ placeholder } { ...field } />
                </FormControl>

                <Button variant={ 'outline' } size={ 'icon' } type="button" onClick={ () => setShowPassword( ( c ) => !c ) }>
                    { showPassword ? <Eye /> : <EyeOff /> }
                </Button>
            </div>
            <FormDescription>
                { fieldState.error?.message ?? "" }
            </FormDescription>
        </FormItem>
    );
}