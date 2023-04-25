import Glossary from '@/components/Glossary';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';

const glossaries = [
  {
    word: 'Hit',
    description:
      '配られたカード（ハンド）にもう1枚カード追加すること。カードの数値の合計が21以内であれば何度でもヒットを行い、カードを追加することができます。'
  },
  {
    word: 'Stand',
    description:
      ' 配られたカード（ハンド）にそれ以上のカードの追加は行わないと宣言すること。プレイヤーは手元のカードの数字でディーラーとの勝負に挑みます。'
  },
  {
    word: 'Double',
    description:
      '賭金をゲーム開始時の倍にして3枚目のカードを引くこと。ただし、Doubleの宣言を行うとそれ以上のカードを引くことはできなくなります。'
  },
  {
    word: 'Bust',
    description:
      '配られたカード（ハンド）の点数が21点をオーバーしてしまうこと。Bustした時点で負けとなります。'
  }
];

const GameRule = () => (
  <Layout>
    <div className="my-10 mx-3 rounded-md border-4 border-red-600 p-4">
      <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
        ルール説明
      </p>
      <Rule
        gameTitle="Blackjack"
        gameDescription="Blackjackは、21 (twenty one)という名称でも知られており、世界から愛されるカードゲームです。カジノディーラーとの駆け引きがあるため、自分なりに戦略を立てられるのがこのゲームの人気の秘訣です。
          ルールも覚えやすく、なんといってもBlackjackの醍醐味は奥の深いゲーム性にあると言えるでしょう。"
        ruleDescription="カジノディーラーとプレイヤーの対戦型ゲームです。プレイヤーはカジノディーラーよりもカードの合計が21に近ければ勝利となり、配当を得ることができます。
          ただし、プレイヤーのカードの合計が21を超えてしまうと、その時点で負けとなります。
          手札のカードの点数は、カード 2～10ではその数字通りの値であり、絵札であるK（キング）、Q（クイーン）、J（ジャック）は10と数えます。
          また、A（エース）は1と11のどちらか、都合の良い方で数えることができます。
          最初に配られた2枚のカードがAとK, Q, J, 10のいずれかで合計21となる場合を”Blackjack”と呼び、その時点で勝ちとなります。"
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
