import { ListRes } from "./api";
import { AppFile } from "./file";

export type Post = {
    id: number;
    title: string;
    content: string;
    digest?: string;
    feature_image: AppFile | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};


export type PostListRes = ListRes & { posts: Post[]; };
