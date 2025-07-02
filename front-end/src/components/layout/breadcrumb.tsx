'use client';

import { useBreadcrumbStore } from "@/store/use-breadcrumb-store";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Fragment } from "react";

export default function AppBreadcrumb ()
{

    const breadcrumbStore = useBreadcrumbStore();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                { breadcrumbStore.breadcrumbs.map( ( item, index ) => (
                    <Fragment key={ item.text }>
                        <BreadcrumbItem key={ index }>
                            { item.url ? (
                                <BreadcrumbLink href={ item.url }>
                                    { item.text }
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>
                                    { item.text }
                                </BreadcrumbPage>
                            ) }
                        </BreadcrumbItem>

                        { item.url ? <BreadcrumbSeparator /> : null }
                    </Fragment>
                ) ) }
            </BreadcrumbList>
        </Breadcrumb>
    );
}