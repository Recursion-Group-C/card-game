import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Head from 'next/head';
import Image from 'next/image';

const Home = () => (
  <Layout>
    <Head>
      <title>Card Game Stadium</title>
    </Head>

    <div>
      <Image
        src="/images/mainVisual.png"
        width={3840}
        height={694}
        layout="responsive"
        alt="homePage"
      />

      <div className="my-10 mx-3 rounded-md border-4 border-red-600 p-2">
        <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
          SELECT GAME
        </p>
        <div className="flex flex-wrap justify-around">
          <Card
            title="BLACKJACK"
            description="簡単なギャンブルゲーム。カードの合計点数が21点を超えないないで、ディーラーより高い点数を取れば勝ちです。"
            url="/games/blackjack"
            imgPath="/images/thumbnailSample.png"
            ruleUrl="/rules/blackjack"
          />
          <Card
            title="WAR"
            description="数字の大小で勝負するシンプルなゲーム。1枚だけカードを引き、引いたカードの数字が大きい方が勝ちです。"
            url="/games/war"
            imgPath="/images/thumbnailSample.png"
            ruleUrl="/rules/war"
          />
          <Card
            title="SPEED"
            description="導け、机上の最速理論！場に出されたカードに繋がる数字を相手よりも早く出して手札をなくした方が勝ちです。"
            url="/games/speed"
            imgPath="/images/thumbnailSample.png"
            ruleUrl="/rules/speed"
          />
          <Card
            title="POKER"
            description="5枚のカードで役を作ります！カードの交換は1回だけ。国内で知名度のある基本的なポーカーゲームです。"
            url="/games/poker"
            imgPath="/images/thumbnailSample.png"
            ruleUrl="/rules/poker"
          />
          {/* <Card
            title="Texas Hold'em Poker"
            description="世界的に大流行のポーカーゲーム。自分の手札は2枚。場に出される最大5枚のカードから役を作り、勝負！"
            url="/games/holdem"
            imgPath="/images/thumbnailSample.png"
            ruleUrl="/rules/holdem"
          />
          <Card
            title="Rummy"
            description="麻雀+花札のようなゲームです。場に出されたカードへも「付け札」が行え、最初に手札をなくした人の勝ちです。"
            url="/games/rummy"
            imgPath="/images/thumbnailSample.png"
            ruleUrl="/rules/rummy"
          /> */}
        </div>
      </div>
    </div>
  </Layout>
);

export default Home;
