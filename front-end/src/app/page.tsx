import { MAP } from "@/components/utils/map";

export default async function Home ()
{

  const array = [ { something: 'asdf' }, { something: 'ass' }, { something: 'asfg' }, { something: 'dfgh' }, { something: 'xcvf' }, ];

  return (
    <>
      <MAP array={ array }>
        { ( item ) => (
          <div>
            { item.something }
          </div>
        ) }
      </MAP>
    </>
  );

}
