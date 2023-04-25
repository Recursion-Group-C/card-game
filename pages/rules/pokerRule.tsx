import Head from 'next/head';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';
/* eslint-disable */
const pokerRule = () => {
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
            title="pokerとは??"
            description="pokerは、トランプを使用してプレイされるカードゲームの一種です。プレイヤーは、配られたカードの組み合わせに基づいて、自分の手札を評価し、ベットやフォールドなどのアクションを取りながら、他のプレイヤーと競い合います。ポーカーは、運の要素がある一方で、戦略や心理戦の要素も含まれるため、非常に奥深く、世界中で愛されるゲームの一つです。"
            ruleTitle="基本ルールとは??"
            ruleDescription="2人のプレイヤーが同じ役を作った場合は、役を構成しているカードの数字が強い方（A、K、・・・2の順）が勝ちとなります。
          役を構成しているカードも同じ場合は、役に使われていないカードが強い方が勝ちとなります。"
            people="基本人数とは??"
            peopleDescription="Dealer and Player (2人)"
            glossary="用語説明"
            glossaryPrompt="poker"
            backUrl="/"

          />
          </div>
          </div>
    </Layout>
  );
};
export default pokerRule;
