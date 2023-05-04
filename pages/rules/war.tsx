import Glossary from '@/components/Glossary';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';

const glossaries = [
  {
    word: '手札',
    description: 'プレイヤーのカード。'
  },
  {
    word: '場札',
    description:
      '「手札」からめくられ場にオモテ向きに出されたカード。'
  }
];

const GameRule = () => (
  <Layout>
    <div className="my-10 mx-3 rounded-md border-4 border-red-600 p-4">
      <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
        ルール説明
      </p>
      <Rule
        gameTitle="Casino War"
        gameDescription="Casino Warの特徴は、プレイヤーとディーラーがそれぞれ1枚のカードを用いて1対1で勝負をするという点にあります。
          互いのトランプの数字の大小で勝敗が決まるので、スピーディーかつ単純明快です。
          1ゲームが非常に短いことからテンポよく進められ、シンプルなルールなので誰にでも理解ができて取り掛かりやすいことも魅力です。"
        ruleDescription="カジノディーラーとプレイヤーの対戦型ゲームです。プレイヤーはカジノディーラーよりもカードの数が大きければ勝利となり、配当を得ることができます。
          手札のカードの点数は、A（エース）が最強で、その他は数字通りの値です。
          ディーラーが、自身と相手プレイヤーに、それぞれ1枚ずつ裏向きにしてカードを配り、勝負宣言をして、数字が大きいほうが勝ちとなります。
          ディーラーの数字が高かった場合はプレイヤーが賭けた金額を回収し、プレイヤーが勝った場合は、2倍の配当を得ることができます。
          引き分けの場合、賭金の半分を払いゲームを降りる（Surrender）か、Warを選択することができます。
          後者を選択すると、賭金と同額をさらに賭けてゲームを繰り返すことができます。
          その勝負でディーラーが勝った場合はプレイヤーの賭金を全て回収し、プレイヤーが勝つと最初の賭金は返却、追加分はその2倍の配当となります。"
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
