import Head from 'next/head';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';

const warRule = () => {
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
              title="カジノwarとは??"
              description="カジノウォーの特徴は、プレイヤーとディーラーがそれぞれ1枚のカードを用いて1対1で勝負をするという点にあります。
                            互いのトランプの数字の大小で勝敗が決まるので、スピーディーかつ単純明快です。
                            1ゲームが非常に短いことからテンポよく進められ、シンプルなルールなので誰にでも理解ができて取り掛かりやすいことも魅力です。"
              ruleTitle="基本ルールとは??"
              ruleDescription="A → K → Q → J → 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2の順でカードの強さが変わり、
            カードマークは勝敗に影響しません。
            また、お互い、カードを出し合い、場に出されたカードの中で一番強いカードを出した人が勝者となり、場に出された「場札」をすべて獲得となります。"
              people="基本人数とは??"
              peopleDescription="Dealer and Player (2人)"
              glossary="用語説明"
              glossaryPrompt="war"
              backUrl="/"
            />
            </div>
          </div>
    </Layout>
    </>
  );
};
export default warRule;
