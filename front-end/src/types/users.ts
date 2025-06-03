import { ListRes } from "./api";

export type User = {
    id: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    phone_number: number,
    role: EUserRole,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date | null;
};

export type UserListRes = ListRes & { users: User[]; };

export enum EUserRole { Admin = 'admin', User = 'user', }
