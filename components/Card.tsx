import Link from 'next/link';

const Card = ({
  title,
  description,
  url,
  imgPath,
  ruleUrl
}: {
  title: string;
  description: string;
  url: string;
  imgPath: string;
  ruleUrl: string;
}) => (
  <div className="card m-1 w-72 bg-base-300 shadow-xl">
    <figure>
      <img src={imgPath} alt="thumbnail" />
    </figure>
    <div className="card-body items-center text-center">
      <h2 className="card-title">{title}</h2>
      <p>{description}</p>
      <div className="card-actions mt-2">
        <Link href={ruleUrl}>
          <button
            className="h-12 w-64 rounded-full border-white bg-base-100 px-4 py-2 text-white hover:bg-base-200"
            type="button"
          >
            <p className="text-xl">Rule</p>
          </button>
        </Link>
        <Link href={url}>
          <button
            className="h-12 w-64 rounded-full border-white bg-red-600 px-4 py-2 text-white hover:bg-red-500"
            type="button"
          >
            <p className="text-xl">Play</p>
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default Card;
