import Link from 'next/link';
import handleTableCreate from './Table';

const Rule = ({
  title,
  description,
  ruleTitle,
  ruleDescription,
  people,
  peopleDescription,
  glossary,
  glossaryPrompt,
  backUrl
}: {
  title: string;
  description: string;
  ruleTitle: string;
  ruleDescription: string;
  people: string;
  peopleDescription: string;
  glossary: string;
  glossaryPrompt: string;
  backUrl: string;
}) => (
  /* eslint-disable */
  <>
    <div className="flex flex-col gap-4">
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-primary ">
          {title}
        </div>
      </div>
      <div className="flex w-full flex-col border-opacity-50">
        <div className="card rounded-box grid h-20 place-items-center bg-base-300">
          {description}
        </div>
        <div className="divider"></div>
        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-info">
            {ruleTitle}
          </div>
        </div>
        <div className="h-50 card rounded-box mt-3 grid place-items-center bg-base-300">
          {ruleDescription}
        </div>
      </div>

      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-primary ">
          {people}
        </div>
      </div>
      <div className="flex w-full flex-col border-opacity-50">
        <div className="card rounded-box grid h-20 place-items-center bg-base-300">
          {peopleDescription}
        </div>
        <div className="divider"></div>
        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-info">
            {glossary}
          </div>
        </div>
        <div className="h-50 card rounded-box mt-3 grid place-items-center bg-base-300">
          {handleTableCreate(glossaryPrompt)}
        </div>
      </div>
      <Link href={backUrl}>
        <button
          className="mt-5 h-12 w-64 rounded-full border-white bg-red-600 px-4 py-2 text-white hover:bg-red-500"
          type="button"
        >
          <p className="text-xl">back</p>
        </button>
      </Link>
    </div>
  </>
);
export default Rule;

{/* <Link href={backUrl}>
          <button
            className="h-12 w-64 rounded-full border-white bg-red-600 px-4 py-2 text-white hover:bg-red-500"
            type="button"
          >
            <p className="text-xl">back</p>
          </button>
        </Link> */}
