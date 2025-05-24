import { existUser } from "@/services/auth";


export default async function Home ()
{

  const response = await existUser( 'asd' );

  return (
    <>
      { JSON.stringify( response ) }
    </>
  );
}
