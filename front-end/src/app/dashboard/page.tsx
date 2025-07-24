import { MAP } from "@/components/utils/map";
import { getUsers } from "@/services/api/users";

export default async function DashboardPage ()
{

    const response = await getUsers( {} );

    if ( response.success === false ) { return; }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>

            <MAP array={ response.data.users } >
                { ( user ) => (
                    <div>
                        <h2>{ user.first_name }</h2>
                        <p>Email: { user.email }</p>
                        <p>Role: { user.role }</p>
                    </div>
                ) }
            </MAP>
        </div>
    );
}