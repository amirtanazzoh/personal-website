import { Files } from "src/modules/database/file.entity";

export type MinioUploaded = Pick<Files, 'name' | 'size' | 'url' | 'type'>;