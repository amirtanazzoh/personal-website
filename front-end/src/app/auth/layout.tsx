import Main from "@/components/layout/main";
import Image from "next/image";
import { PropsWithChildren } from "react";

export default async function AuthLayout ( { children }: PropsWithChildren )
{
    return (
        <Main className="h-screen">
            <div className="flex h-full">

                <div className="w-1/2 flex justify-center items-center">
                    <div className="min-w-full px-4">
                        { children }
                    </div>
                </div>

                <div className="w-1/2">
                    <div className="flex justify-center items-center h-full">
                        <Image
                            src={ '/images/login.svg' }
                            width={ 500 }
                            height={ 500 }
                            alt="image"
                        />
                    </div>
                </div>
            </div>
        </Main>
    );
}