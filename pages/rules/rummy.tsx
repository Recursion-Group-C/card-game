import Glossary from '@/components/Glossary';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';

const glossaries = [
  {
    word: '山札',
    description: '場の裏向きに配置されたカード束。'
  },
  {
    word: '捨て札',
    description:
      '「手札」から出され場にオモテ向きに置かれたカード。「山札」が無くなった場合、「捨て札」をしっかりと切って裏向きにして「新しい山札」として使います。'
  },
  {
    word: '手札',
    description: 'プレイヤーのカード。'
  },
  {
    word: 'メルド',
    description:
      '「手札」の中に、同じ数字のカード3枚以上の組み合わせ（グループ）、もしくは同じマークで数字が連続するカード3枚以上の組み合わせ（シーケンス）があった場合、 それらのカードを「手札」場に設けられた「メルドエリア」へ移し、公開すること。'
  },
  {
    word: 'グループ',
    description:
      'セットとも呼ばれ、3枚以上の同じランクのカードを作ること。'
  },
  {
    word: 'シーケンス',
    description:
      'ランとも呼ばれ、3枚以上の同スートで連続したランクのカードのこと。ただし、Aは常に1として扱い、Kとは連続しない。'
  },
  {
    word: '付け札',
    description:
      'メルドエリアに公開された自分や相手プレイヤーのメルドに自分の手札のカードを付け加えること。同一数字のセットには同じ数字のカードを付け札することができます。同一マークのセットには同じマークで連続する数字のカードであればカードを付け札することができます。'
  },
  {
    word: 'ラミー',
    description:
      'ゲーム中に一度も「メルド」や「付け札」せずに、最後に手札をいっぺんに公開してあがること。ラミーで上がると点数が2倍になるというメリットがあります。'
  }
];

const GameRule = () => (
  <Layout>
    <div className="my-10 mx-3 rounded-md border-4 border-red-600 p-4">
      <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
        ルール説明
      </p>
      <Rule
        gameTitle="Rummy"
        gameDescription="Rummyは麻雀に似たゲームです。
          同じ数字のカードを3枚以上、もしくは同じマークで連続する数字のカードを3枚以上揃えて役を作っていき、手札を減らしていくゲームです。
          一番早く「手札」を無くしたプレイヤーが勝ちとなります。"
        ruleDescription="このゲームでは、まず最初にディーラーとプレイヤーに10枚ずつカードを配ります。
          ゲームの目的は、手札のカードを組み合わせて、3枚以上のシーケンス（同じスートの連続するカード）または3枚以上のセット（同じランクのカード）を作り、手札をなくすことです。
          また、ゲーム中に一度も「メルド」や「付け札」せずに、最後に手札をいっぺんに公開してあがることをラミーと呼び、ラミーで上がると点数が2倍になるというメリットがあります。
          また、プレイヤーは、相手の手札に対して1つまたは複数のカードを追加することで、既存のシーケンスやセットを拡張することもできます。
          山札が尽きた場合、捨て札を切りなおして山札にします。ただし、2回山札が尽きた場合は引き分けとなります。"
        peopleDescription="ディーラーとプレイヤーの2人です。"
      />

      <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
        用語説明
      </p>
      <Glossary glossaries={glossaries} />
    </div>
  </Layout>
);
export default GameRule;
