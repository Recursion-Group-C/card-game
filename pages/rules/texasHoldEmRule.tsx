import Head from 'next/head';
import Layout from '@/components/Layout';
import Rule from '@/components/Rule';

const texasHoldEmRule = () => {
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
              準備中
            </div>
          </div>
    </Layout>
    </>
  );
};
export default texasHoldEmRule;
