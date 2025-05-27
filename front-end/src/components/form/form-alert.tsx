import { isUndefined } from "@/utils/basic";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CircleCheck, OctagonX } from "lucide-react";

export default function FormAlert ( props: { message: string, status: undefined | Boolean; } )
{

    if ( isUndefined( props.status ) ) return null;

    return (
        <Alert variant={ props.status ? 'success' : 'destructive' }>
            { props.status ? <CircleCheck /> : <OctagonX /> }
            <AlertTitle>{ props.status ? 'Success' : 'Error' }</AlertTitle>
            <AlertDescription>
                <pre className="whitespace-pre-wrap break-words max-w-full box-border">
                    { props.message.charAt( 0 ).toUpperCase() + props.message.slice( 1 ) }
                </pre>
            </AlertDescription>
        </Alert>
    );
}