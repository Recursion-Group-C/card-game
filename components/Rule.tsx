import Link from 'next/link';

const Rule = ({
  title,
  description,
  ruleTitle,
  ruleDescription,
  people,
  peopleDescription,
  glossary,
  glossaryPrompt,
  backUrl,
}: {
  title: string;
  description: string;
  ruleTitle: string;
  ruleDescription: string;
  people: string,
  peopleDescription: string;
  glossary: string;
  glossaryPrompt: string;
  backUrl: string;
}) => (
  <>
    <div className="flex flex-col gap-4">
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-primary ">{title}</div>
      </div>
      <div className="flex flex-col w-full border-opacity-50">
        <div className="grid h-20 card bg-base-300 rounded-box place-items-center">{description}</div>
        <div className="divider"></div>
        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-info">{ruleTitle}</div>
        </div>
        <div className="mt-3 grid h-50 card bg-base-300 rounded-box place-items-center">{ruleDescription}</div>
      </div>

      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-primary ">{people}</div>
      </div>
      <div className="flex flex-col w-full border-opacity-50">
        <div className="grid h-20 card bg-base-300 rounded-box place-items-center">{peopleDescription}</div>
        <div className="divider"></div>
        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-info">{glossary}</div>
        </div>
        <div className="mt-3 grid h-50 card bg-base-300 rounded-box place-items-center">{glossaryPrompt}</div>
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
