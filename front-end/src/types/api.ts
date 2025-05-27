export type GeneralApiRes<T> = {
    success: true;
    data: T;
} | {
    success: false;
    statusCode: number;
    message: string;
};

export type ListRes = {
    total: number;
    page: number;
    lastPage: number;
};

export type ListRequestParams<T> = {
    sortBy?: keyof T;
    order?: 'asc' | 'desc';
    limit?: number;
    page?: number;
    search?: string;
};