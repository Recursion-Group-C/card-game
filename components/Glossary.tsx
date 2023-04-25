type Props = {
  glossaries: Array<{
    word: string;
    description: string;
  }>;
};

const Glossary = ({ glossaries }: Props) => (
  <div className="overflow-x-auto">
    <table className="table-zebra table w-full">
      {/* head */}
      <thead>
        <tr>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <th />
          <th>Word</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {glossaries.map((glossary, index) => (
          <tr>
            <th>{index + 1}</th>
            <td>{glossary.word}</td>
            <td>{glossary.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Glossary;
