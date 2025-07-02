import GreetingMessage from "@/components/helpers/greeting-message";
import PageWrapper from "@/components/layout/page-wrapper";

export default function DashboardPage ()
{
    return (
        <PageWrapper>
            <div className="">
                <GreetingMessage />
            </div>
        </PageWrapper>
    );
}