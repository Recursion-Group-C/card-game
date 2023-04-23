import Head from 'next/head';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';


const speedRule = () => {
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
            title="speedとは"
            description="Speedは、トランプを使ったカードゲームで、プレイヤーは同じスートのカードを数値の順序に沿って積み重ねて自分の山札を手札に置くことが目的です。最初にカードを全て置くか、またはカードを置けなくなるまでプレイし、手札を最も早くすべて置くプレイヤーが勝者となります。2人用または複数人用に遊ぶことができます。"
            ruleTitle="基本ルール"
            ruleDescription="Speedは、トランプを使用したカードゲームの一つです。このゲームは、2人用または複数人用に遊ぶことができます。
            プレイヤーは、同じスートのカードを数値の順序に沿って積み重ねて、自分の山札を手札にすばやく置くことを目的としています。ゲームは、2人のプレイヤーが、最初にすべてのカードを置くまで、または残りのカードを置けなくなるまで続きます。
            プレイヤーは、自分の手札を表にし、それらを積み重ねることができる場合はすぐに置くことができます。また、山札から1枚ずつカードを引いて、手札に追加することもできます。最初にカードをすべて置くか、カードを置けなくなるまでプレイし、最も早く手札を置くプレイヤーが勝者となります。"
            people="基本人数"
            peopleDescription="Dealer and Player (2人)"
            glossary="用語説明"
            glossaryPrompt="山札 (stock) => プレイヤーが引くカードの山のことです。
            手札 (hand) => プレイヤーが持つカードのことです。
            場札 (play pile) => 各プレイヤーが、同じスートのカードを数値の順序に沿って積み重ねる場所のことです。
            ワーキングエリア (working area) => 各プレイヤーが、手札を置いて、場札に移すことができるエリアのことです。
            マッチ (match) => 同じスートのカードを数値の順序に沿って積み重ねることです。
            ブロック (block) => プレイヤーが手札をすべて出すことができず、カードを置けなくなった状態のことです。
            タイム (time) => カードを置くことができる制限時間のことです。通常、1分間です。
            "
            backUrl="/"
            
          />
          </div>
          </div>
    </Layout>
    </>
  );
};
export default speedRule;
