export function getCorrectBuffer ( file: Express.Multer.File )
{
    if ( Buffer.isBuffer( file.buffer ) )
    {
        return file.buffer;
    }

    //@ts-ignore
    return Buffer.from( Object.values( file.buffer.data ) );
}
