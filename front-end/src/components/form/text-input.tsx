import { FormInputInnerProps } from "@/types/fields";
import { FormControl, FormDescription, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export default function TextInput ( { field, fieldState, label, placeholder, type = "text", }: FormInputInnerProps )
{
    return (
        <FormItem>
            <FormLabel>{ label }</FormLabel>
            <FormControl>
                <Input { ...field } type={ type } placeholder={ placeholder } />
            </FormControl>
            <FormDescription>
                { fieldState.error?.message ?? "" }
            </FormDescription>
        </FormItem>
    );
}