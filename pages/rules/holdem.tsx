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
        gameTitle="Texas Hold'em Porker"
        gameDescription="準備中"
        ruleDescription="準備中"
        peopleDescription="準備中"
      />

      <p className="mb-3 text-center text-3xl underline decoration-red-600 decoration-2">
        用語説明
      </p>
      <Glossary glossaries={glossaries} />
    </div>
  </Layout>
);

export default GameRule;
