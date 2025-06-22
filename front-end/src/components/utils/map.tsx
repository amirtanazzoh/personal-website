import { Fragment, ReactNode } from "react";
import { IF } from "./if";
import { isDefined, isNotEmptyArray } from "@/utils/basic";
import { v4 } from "uuid";



export function MAP<T> ( { children, array }: { children: ( item: T, index: number ) => ReactNode, array: T[]; } )
{
    return (
        <IF condition={ isNotEmptyArray( array ) }>
            { array.map( ( item, index ) =>
            {
                //@ts-ignore
                const key = isDefined( item.id ) ? item.id : v4();

                return (
                    <Fragment key={ key }>
                        { children( item, index ) }
                    </Fragment>
                );
            } ) }
        </IF>
    );
}