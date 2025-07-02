export default function PageWrapper ( props: React.PropsWithChildren<{}> )
{
    return (
        <div className="w-full px-4">
            { props.children }
        </div>
    );
}