import { GeneralApiRes, ListRequestParams } from "@/types/api";
import { requestWrapper } from "../utils/api";
import { userAxios } from "./axios";
import { User, UserListRes } from "@/types/users";

export async function getUsers ( params: ListRequestParams<User> ): Promise<GeneralApiRes<UserListRes>>
{ return await requestWrapper( userAxios.get( '', { params } ) ); }