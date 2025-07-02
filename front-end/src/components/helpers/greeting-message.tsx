'use client';

import { useEffect, useState } from "react";

export default function GreetingMessage ()
{

    const [ message, setMessage ] = useState<string>( "" );


    useEffect( () =>
    {
        const currentHour = new Date().getHours();

        if ( currentHour < 5 )
        {
            setMessage( "🌙 Hey night owl! Hope you're doing great this late!" );
        } else if ( currentHour < 9 )
        {
            setMessage( "🌅 Good early morning! Rise and shine, sleepyhead ☕️" );
        } else if ( currentHour < 12 )
        {
            setMessage( "☀️ Good morning! Let's make today amazing 💪" );
        } else if ( currentHour < 18 )
        {
            setMessage( "🌞 Good afternoon! Keep pushing, you're doing awesome! ✨" );
        } else if ( currentHour < 22 )
        {
            setMessage( "🌇 Good evening! Time to slow down and relax 🧘" );
        } else
        {
            setMessage( "🌙 Good night! Sweet dreams and cozy vibes 😴" );
        }
    }, [] );


    return (
        <div className="flex">
            <p className="text-gray-600">{ message }</p>
        </div>
    );
}