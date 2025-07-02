'use client';

import { useBreadcrumbStore } from "@/store/use-breadcrumb-store";
import { useEffect } from "react";

export default function Page ()
{

    const breadcrumbStore = useBreadcrumbStore();

    useEffect( () =>
    {
        breadcrumbStore.setBreadcrumbs( [
            { text: 'Admin Dashboard', url: '/admin/dashboard' },
            { text: 'Posts' },
        ] );
    }, [] );

    return (
        <>
        </>
    );
}