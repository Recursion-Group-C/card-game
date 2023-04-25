import Head from 'next/head';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';
/* eslint-disable */
const rummyRule = () => {
  return (
    <>
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
            title="rummyとは??"
            description="rummyでは、各プレイヤーは手札から組み合わせを作り、最終的に手札を完全に捨てることを目指します。
          Rummyの主な目的は、カードをセット（同じランクの3枚以上）やシーケンス（同じスートの3枚以上のランクの連続するカード）に組み合わせることで、手札からできるだけ早くカードを捨てることです。プレイヤーが最後のカードを捨てた時点で、最も高いスコアを持つプレイヤーが勝利します。
          Rummyは、ルールが簡単で、戦略性があるため、世界中で愛されるカードゲームの一つです。"
            ruleTitle="基本ルールとは??"
            ruleDescription="このゲームでは、まず最初にplayerとdealerに10枚ずつカードを配ります。
          ゲームの目的は、手札のカードを組み合わせて、3枚以上のシーケンス（同じスートの連続するカード）または3枚以上のセット（同じランクのカード）を作り、手札をなくすことです。
          また、手札から3枚以上のシーケンスまたはセットを作ることに加えて、最初のターンで手札のすべてのカードを使ってしまったプレイヤーが「ラミー」と呼ばれ、ラウンドに勝利することもできます。また、プレイヤーは、相手の手札に対して1つまたは複数のカードを追加することで、既存のシーケンスやセットを拡張することもできます。
          山札が尽きた場合、捨て札を切りなおして山札にします。ただし、2回山札が尽きた場合は引き分けとなります。"
            people="基本人数とは??"
            peopleDescription="Dealer and Player (2人)"
            glossary="用語説明"
            glossaryPrompt="rummy"
            backUrl="/"

          />
          </div>
          </div>
    </Layout>
    </>
  );
};
export default rummyRule;
