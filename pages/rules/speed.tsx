import Glossary from '@/components/Glossary';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';

const glossaries = [
  {
    word: '場札',
    description: 'プレイヤーのカード。'
  },
  {
    word: '台札',
    description:
      '「山札」からめくられ場にオモテ向きに出された2枚のカード。'
  },
  {
    word: '手札',
    description:
      '手札の横に裏向きに伏せて束ねられたカードの束。各ゲーム開始時にそれぞれの山札の一番上のカードをめくりオモテにして「台札」へと配置します。またゲーム中に手札がなくなったときも「山札」から補充を行います。'
  }
];

const GameRule = () => (
  <Layout>
    <div className="my-10 mx-3 rounded-md border-4 border-red-600 p-4">
      <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
        ルール説明
      </p>
      <Rule
        gameTitle="Speed"
        gameDescription="台札と数字がつながるカードをすばやく出していきます。相手より先に、手持ちのカードがなくなると勝ちです。"
        ruleDescription="トランプの赤いカード（♥♦）をプレイヤー、黒いカード（♠♣）をディーラーの手札にします。
          自分の「手札」の束をを裏向きにして手元に配置し、上から4枚のカードを自分の前に表向きに置きます。これが場札となります。
          自分の「場札」を見て、掛け声とともに出した2枚の台札のどちらかに隣り合った数字のカードがあれば、その台札の上へ「場札」を素早く上に重ねます。これが次に新しい台札となります。
          2人とも台札のカードに重ねられる場札がなくなったら、もう一度「掛け声」とともに手札から新しい台札を出します。
          このようにしてゲームを進め、一番最初に「場札」と「手札」の両方を消化したプレイヤーがゲーム全体の勝者となります。
          "
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
