import { FormInputInnerProps } from "@/types/fields";
import { FormControl, FormDescription, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export default function PhoneNumberInput ( { field: { onChange, ...restField }, fieldState, label, placeholder }: FormInputInnerProps )
{

    function handleChange ( e: React.ChangeEvent<HTMLInputElement> )
    {
        let value = e.target.value.replace( /\D/g, "" );
        if ( value.length > 0 && value[ 0 ] !== "9" )
        { value = ""; }
        onChange( value.slice( 0, 10 ) );
    }

    return (
        <FormItem>
            <FormLabel>{ label }</FormLabel>
            <div className="flex gap-2">

                <Input readOnly disabled value={ '+98' } className="w-[7ch]" />

                <FormControl>
                    <Input type={ 'tel' } placeholder={ placeholder } onChange={ handleChange } { ...restField } />
                </FormControl>
            </div>
            <FormDescription>
                { fieldState.error?.message ?? "" }
            </FormDescription>
        </FormItem>
    );
}