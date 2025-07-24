import { GeneralApiRes, ListRequestParams } from "@/types/api";
import { AxiosInstanceFactory } from "./axios";
import { Post, PostListRes } from "@/types/posts";

const postAxios = new AxiosInstanceFactory( 'posts' );

const instance = postAxios.getInstance();

export async function getPosts ( params: ListRequestParams<Post> ): Promise<GeneralApiRes<PostListRes>> { return instance.get( '', { params } ); }