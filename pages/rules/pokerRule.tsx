import Head from 'next/head';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';

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
            title="pokerとは"
            description="ポーカーは、トランプを使用してプレイされるカードゲームの一種です。プレイヤーは、配られたカードの組み合わせに基づいて、自分の手札を評価し、ベットやフォールドなどのアクションを取りながら、他のプレイヤーと競い合います。ポーカーは、運の要素がある一方で、戦略や心理戦の要素も含まれるため、非常に奥深く、世界中で愛されるゲームの一つです。"
            ruleTitle="基本ルール"
            ruleDescription="2人のプレイヤーが同じ役を作った場合は、役を構成しているカードの数字が強い方（A、K、・・・2の順）が勝ちとなります。
          役を構成しているカードも同じ場合は、役に使われていないカードが強い方が勝ちとなります。"
            people="基本人数"
            peopleDescription="Dealer and Player (2人)"
            glossary="用語説明"
            glossaryPrompt="ロイヤルストレートフラッシュ => 同じマークの10、J、Q、K、Aをそろえる。
            ストレートフラッシュ => 同じマークで、5枚の数字が連続する。
            フォーカード => 同じ数字のカードが4枚ある。
            フルハウス => スリーカードとワンペアが1組ずつできる。
            フラッシュ => 同じマークのカードが5枚ある。
            ストレート => マークに関係なく5枚の数字が連続する。
              （10-J-Q-K-AはストレートとなるがQ-K-A-2-3はストレートにならない。
              すなわちKとAは連続するがK-A-2含むものはストレートにはならない）
            スリーカード => 同じ数字のカードが3枚ある。
            ツーペア => 同じ数字のカードが2組ある。
            ワンペア => 同じ数字のカードが1組だけある。
            "
            backUrl="/"
            
          />
          </div>
          </div>
    </Layout>
  );
};
export default pokerRule;


{/* <div className="">
        <h1>poker ルール説明</h1>
        <h2>pokerとは</h2>
        <div>
          ポーカーは、トランプを使用してプレイされるカードゲームの一種です。プレイヤーは、配られたカードの組み合わせに基づいて、自分の手札を評価し、ベットやフォールドなどのアクションを取りながら、他のプレイヤーと競い合います。ポーカーは、運の要素がある一方で、戦略や心理戦の要素も含まれるため、非常に奥深く、世界中で愛されるゲームの一つです。
        </div>
        <h2>基本ルール</h2>
        <div>
          2人のプレイヤーが同じ役を作った場合は、役を構成しているカードの数字が強い方（A、K、・・・2の順）が勝ちとなります。
          役を構成しているカードも同じ場合は、役に使われていないカードが強い方が勝ちとなります。
        </div>
        <h2>基本人数</h2>
        <div>Dealer and Player (2人)</div>
        <h2>用語説明</h2>
        <table className="">
          <tr>
            <td>ロイヤルストレートフラッシュ</td>
            <td>ストレートフラッシュ</td>
            <td>フォーカード</td>
          </tr>
          <tr>
            <td>同じマークの10、J、Q、K、Aをそろえる。</td>
            <td>同じマークで、5枚の数字が連続する。</td>
            <td>同じ数字のカードが4枚ある。</td>
          </tr>
        </table>
        <table className="">
          <tr>
            <td>フルハウス</td>
            <td>フラッシュ</td>
            <td>ストレート</td>
          </tr>
          <tr>
            <td>スリーカードとワンペアが1組ずつできる。</td>
            <td>同じマークのカードが5枚ある。</td>
            <td>
              マークに関係なく5枚の数字が連続する。
              （10-J-Q-K-AはストレートとなるがQ-K-A-2-3はストレートにならない。
              すなわちKとAは連続するがK-A-2含むものはストレートにはならない）
            </td>
          </tr>
        </table>
        <table className="">
          <tr>
            <td>スリーカード</td>
            <td>ツーペア</td>
            <td>ワンペア</td>
          </tr>
          <tr>
            <td>同じ数字のカードが3枚ある。</td>
            <td>同じ数字のカードが2組ある。</td>
            <td>同じ数字のカードが1組だけある。</td>
          </tr>
        </table>
      </div> */}
