import Glossary from '@/components/Glossary';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';

const glossaries = [
  {
    word: 'ロイヤルストレートフラッシュ',
    description: '同じマークの10、J、Q、K、Aが揃うこと。'
  },
  {
    word: 'ストレートフラッシュ',
    description:
      '同じマークかつ5枚の数字が連続するカードが揃うこと。'
  },
  {
    word: 'フォーカード',
    description: '同じ数字のカードが4枚揃うこと。'
  },
  {
    word: 'フルハウス',
    description: 'スリーカードとワンペアが1組ずつ揃うこと。'
  },
  {
    word: 'フラッシュ',
    description: '同じマークのカードが5枚揃うこと。'
  },
  {
    word: 'ストレート',
    description:
      'マークに関係なく数字が連続するカードが5枚揃うこと。（10-J-Q-K-AはストレートとなるがQ-K-A-2-3はストレートにならない。）'
  },
  {
    word: 'スリーカード',
    description: '同じ数字のカードが3枚揃うこと。'
  },
  {
    word: 'ツーペア',
    description: '同じ数字のカードが2組揃うこと。'
  },
  {
    word: 'ワンペア',
    description: '同じ数字のカードが1組揃うこと。'
  }
];

const GameRule = () => (
  <Layout>
    <div className="my-10 mx-3 rounded-md border-4 border-red-600 p-4">
      <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
        ルール説明
      </p>
      <Rule
        gameTitle="Poker"
        gameDescription="Pokerは、トランプを使用してプレイされるカードゲームの一種です。
          プレイヤーは、配られたカードの組み合わせに基づいて、自分の手札を評価し、ベットやフォールドなどのアクションを取りながら、他のプレイヤーと競い合います。
          Pokerは、運の要素がある一方で、戦略や心理戦の要素も含まれるため、非常に奥深く、世界中で愛されるゲームの一つです。"
        ruleDescription="2人のプレイヤーが同じ役を作った場合は、役を構成しているカードの数字が強い方（A、K、・・・2の順）が勝ちとなります。
          役を構成しているカードも同じ場合は、役に使われていないカードが強い方が勝ちとなります。"
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
