import { GeneralApiRes, ListRequestParams } from "@/types/api";
import { AxiosInstanceFactory } from "./axios";
import { User, UserListRes } from "@/types/users";

const userAxios = new AxiosInstanceFactory( 'users' );

const instance = userAxios.getInstance();


export async function getUsers ( params: ListRequestParams<User> ): Promise<GeneralApiRes<UserListRes>>
{ return instance.get( '', { params } ); }
