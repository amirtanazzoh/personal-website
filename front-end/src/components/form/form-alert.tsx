import { isDefined } from "@/utils/basic";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CircleCheck, OctagonX } from "lucide-react";
import { IF } from "../utils/if";

export default function FormAlert ( props: { message: string, status: undefined | Boolean; } )
{

    return (
        <IF condition={ isDefined( props.status ) }>
            <Alert variant={ props.status ? 'success' : 'destructive' }>
                { props.status ? <CircleCheck /> : <OctagonX /> }
                <AlertTitle>{ props.status ? 'Success' : 'Error' }</AlertTitle>
                <AlertDescription>
                    <pre className="whitespace-pre-wrap break-words max-w-full box-border">
                        { props.message }
                    </pre>
                </AlertDescription>
            </Alert>
        </IF>
    );
}