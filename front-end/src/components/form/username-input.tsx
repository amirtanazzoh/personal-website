import { FormInputInnerProps } from "@/types/fields";
import { FormControl, FormDescription, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export default function UsernameInput ( { field: { onChange, ...restField }, fieldState, label, placeholder }: FormInputInnerProps )
{

    function handleChange ( e: React.ChangeEvent<HTMLInputElement> )
    {
        let input = e.target.value;

        input = input.replace( /[^a-zA-Z0-9._]/g, "" );

        if ( input.length > 0 && !/^[a-zA-Z]/.test( input[ 0 ] ) ) { input = ""; }

        input = input.slice( 0, 30 );

        onChange( input );
    }

    return (
        <FormItem>
            <FormLabel>{ label }</FormLabel>
            <FormControl>
                <Input type={ 'text' } placeholder={ placeholder } onChange={ handleChange } { ...restField } />
            </FormControl>
            <FormDescription>
                { fieldState.error?.message ?? "" }
            </FormDescription>
        </FormItem>
    );
}