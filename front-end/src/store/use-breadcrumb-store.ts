import { create } from 'zustand';

type BreadcrumbItem = {
    text: string;
    url?: string;
};

type BreadcrumbState = {
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: ( items: BreadcrumbItem[] ) => void;
    clearBreadcrumbs: () => void;
};

export const useBreadcrumbStore = create<BreadcrumbState>( ( set ) => ( {
    breadcrumbs: [],
    setBreadcrumbs: ( items ) => set( () => ( { breadcrumbs: items, } ) ),
    clearBreadcrumbs: () => set( () => ( { breadcrumbs: [], active: '' } ) ),
} ) );
