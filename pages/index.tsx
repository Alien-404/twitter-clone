import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Feed from '../src/components/Feed';
import Sidebar from '../src/components/Sidebar';
import Widgets from '../src/components/Widgets';
import { fetchTweets } from '../src/lib/fetchTweets';
import { Tweet } from '../typings';

interface Props {
  tweets: Tweet[];
}

const Home = ({ tweets }: Props) => {
  return (
    <div className='lg:max-w-6xl mx-auto max-h-screen overflow-hidden'>
      <Head>
        <title>Twitter Clone | Rinaru</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Toaster />
      <main className='grid grid-cols-9'>
        {/* sidebar */}
        <Sidebar />
        {/* feed */}
        <Feed tweets={tweets} />
        {/* widgets */}
        <Widgets />
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tweets = await fetchTweets();

  return {
    props: {
      tweets,
    },
  };
};
