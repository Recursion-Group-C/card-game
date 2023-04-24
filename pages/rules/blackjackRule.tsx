import Layout from '@/components/Layout';
import Head from 'next/head';
import Rule from '@/components/Rule';

const blackjackRule = () => {
  return (
    <Layout>
      <Head>
        <title>ルール説明</title>
      </Head>
      <div className="my-10 mx-3 rounded-md border-4 border-red-600 p-2">
        <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
          ルール説明
        </p>
        <div className="flex">
          <Rule
            title="blackjackとは??"
            description="ブラックジャックは、21(twenty
          one）という名称でも知られており、世界から愛されるカードゲームです。
          カジノディーラーとの駆け引きがあるため、自分なりに戦略を立てられるのがこのゲームの人気の秘訣。ルールも覚えやすく、なんといってもブラックジャックの醍醐味は奥の深いゲーム性にあると言えるでしょう。"
            ruleTitle="基本ルールとは??"
            ruleDescription="カジノディーラーとプレイヤーの対戦型ゲームです。
          プレイヤーはカジノディーラーよりも「カードの合計が21点」に近ければ勝利となり、配当を得ることができます。ただしプレイヤーの「カードの合計が21点」を超えてしまうと、その時点で負けとなります。
          【カードの数え方】
          ”2～9”まではそのままの数字、”10・J・Q・K”は「すべて10点」と数えます。
          また、”A”（エース）は「1点」もしくは「11点」のどちらに数えても構いません。
          【特別な役】 最初に配られた2枚のカードが
          ”Aと10点札”
          で21点が完成していた場合を『ブラックジャック』といい、その時点で勝ちとなります。"
            people="基本人数とは??"
            peopleDescription="Dealer and Player (2人)"
            glossary="用語説明"
            glossaryPrompt="blackjack"
            backUrl="/"

          />
          </div>
          </div>
    </Layout>
  );
};
export default blackjackRule;
