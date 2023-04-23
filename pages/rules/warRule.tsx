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
              glossary="用語説明とは??"
              glossaryPrompt="山札 (stock) => プレイヤーが引くカードの山のことです。
              手札 (hand) => プレイヤーが持つカードのことです。
              バトル (battle) => 各プレイヤーが同じ数字のカードを出した場合に起こる戦闘のことです。
              デッキ (deck) => プレイヤーがカードを引くための山札として使用されるカードの組み合わせのことです。
              ドロー (draw) => 各プレイヤーが、山札からカードを引くことです。
              プレイエリア (playing area) => 各プレイヤーが、自分の手札から出したカードを置く場所のことです。
              ウォー (war) => 各プレイヤーが同じ数字のカードを出した場合に発生し、各プレイヤーが3枚のカードを裏向きにしてデッキからドローし、4枚目のカードを表向きに出すことにより勝者を決定する戦闘のことです。
              "
              backUrl="/"
            />
            </div>
          </div>
    </Layout>
    </>
  );
};
export default warRule;
{/* <Head>
      <div className="">
        <h1>war ルール説明</h1>
        <h2>warとは</h2>
        <div>
          War（ウォー）は、2人以上が参加するトランプゲームで、ランダムにカードを引いて勝者を決定するシンプルなゲームです。
          ゲームが始まると、デッキは均等に分割され、各プレイヤーに配られます。プレイヤーは、同時に1枚ずつカードをめくり、めくったカードのランク（数字）を比較します。高いランクのカードを持っているプレイヤーが勝者となり、2枚のカードを自分の手札に加えます。このプロセスを続け、全てのカードが1人の手札に集まるまで繰り返します。
          ただし、引いたカードが同じランクの場合、それを「戦争」と呼ばれる特別なイベントとして処理します。この場合、プレイヤーは追加のカードをめくって、ランクが高い方が勝者となります。勝者は、戦争でめくった全てのカードを手札に加えます。
          Warは、子供から大人まで楽しめる非常にシンプルなゲームであり、運による要素が強いため、プレイヤーの年齢やスキルレベルに関係なく、気軽に楽しむことができます。
        </div>
        <h2>基本ルール</h2>
        <div>
          A → K → Q → J → 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2の順でカードの強さが変わり、
          カードマークは勝敗に影響しません。
          また、お互い、カードを出し合い、場に出されたカードの中で一番強いカードを出した人が勝者となり、場に出された「場札」をすべて獲得となります。
        </div>
        <h2>基本人数</h2>
        <div>Dealer and Player (2人)</div>
        <h2>用語説明</h2>
        </div>
    </Head>
 */}
