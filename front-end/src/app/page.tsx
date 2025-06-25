/* ─── app/page.tsx (or wherever) ───────────────────────────────────────────── */
'use client';

import { useEffect, useState } from 'react';
import useSocket from '@/hooks/useSocket';

export default function Home ()
{
  const socket = useSocket();
  const [ message, setMessage ] = useState( '' );

  useEffect( () =>
  {
    if ( !socket ) return;

    socket.on( 'connect', () => console.log( '✅ connected' ) );
    socket.on( 'message', ( data ) =>
    {
      console.log( '📨', data );
      setMessage( typeof data === 'string' ? data : JSON.stringify( data ) );
    } );




    return () =>
    {
      socket.off( 'message' );
      socket.off( 'connect' );
    };
  }, [ socket ] );

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Socket.IO in Next.js</h1>
      <p>Message from server: <strong>{ message || '—' }</strong></p>
    </main>
  );
}
