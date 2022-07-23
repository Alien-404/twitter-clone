import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Tweet, TweetBody } from '../../typings';
import { fetchTweets } from '../lib/fetchTweets';

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

export default function TweetBox({ setTweets }: Props) {
  const { data: session } = useSession();
  const [input, setInput] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) return;

    setImage(imageInputRef.current.value);
    imageInputRef.current.value = '';
    setImageUrlBoxIsOpen(false);
  };

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || 'Rinaru 404',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
      image: image,
    };

    const res = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: 'POST',
    });

    const json = await res.json();

    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast('Tweet Posted!', {
      icon: '✨',
    });

    return json;
  };

  const handlerSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    postTweet();

    setInput('');
    setImage('');
    setImageUrlBoxIsOpen(false);
  };

  return (
    <div className='flex space-x-2 p-5'>
      <img
        className='h-14 w-14 object-cover rounded-full'
        src={session?.user?.image || 'https://links.papareact.com/gll'}
        alt='cover-photo'
      />
      <div className='flex flex-1 items-center pl-2'>
        <form className='flex flex-1 flex-col'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type='text'
            placeholder='What Happening?'
            className='h-24 w-full text-xl outline-none placeholder:text-xl'
          />
          <div className='flex items-center'>
            <div className='flex flex-1 space-x-2 text-twitter '>
              {/* icons */}
              <PhotographIcon
                className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150'
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
              />
              <SearchCircleIcon className='h-5 w-5' />
              <EmojiHappyIcon className='h-5 w-5' />
              <CalendarIcon className='h-5 w-5' />
              <LocationMarkerIcon className='h-5 w-5' />
            </div>

            <button
              onClick={handlerSubmit}
              disabled={!input || !session}
              className='bg-twitter px-5 py-2 font-bold text-white rounded-full disabled:opacity-40'
            >
              Tweet
            </button>
          </div>

          {imageUrlBoxIsOpen && (
            <form className='mt-5 flex rounded-lg bg-twitter/80 py-2 px-4'>
              <input
                ref={imageInputRef}
                type='text'
                placeholder='Enter Image Url'
                className='flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white'
              />
              <button
                className='font-bold text-white'
                type='submit'
                onClick={addImageToTweet}
              >
                Add Image
              </button>
            </form>
          )}

          {/* display input image */}
          {image && (
            <img
              src={image}
              alt=''
              className='mt-10 h-40 w-full rounded-xl object-contain shadow-lg'
            />
          )}
        </form>
      </div>
    </div>
  );
}
