type Props = {
  gameTitle: string;
  gameDescription: string;
  ruleDescription: string;
  peopleDescription: string;
};

const Rule = ({
  gameTitle,
  gameDescription,
  ruleDescription,
  peopleDescription
}: Props) => (
  <div className="mb-6 flex flex-col gap-4">
    <div className="chat chat-start">
      <div className="chat-bubble chat-bubble-primary">
        {gameTitle}とはどのようなゲームですか？
      </div>
    </div>
    <div className="chat chat-end">
      <div className="chat-bubble">{gameDescription}</div>
    </div>

    <div className="chat chat-start">
      <div className="chat-bubble chat-bubble-primary">
        ゲームの流れを教えてください。
      </div>
    </div>
    <div className="chat chat-end">
      <div className="chat-bubble">{ruleDescription}</div>
    </div>

    <div className="chat chat-start">
      <div className="chat-bubble chat-bubble-primary">
        プレー人数を教えてください。
      </div>
    </div>
    <div className="chat chat-end">
      <div className="chat-bubble">{peopleDescription}</div>
    </div>
  </div>
);

export default Rule;
