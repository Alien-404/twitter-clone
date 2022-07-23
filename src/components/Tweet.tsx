import {
  ChatAltIcon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactTimeago from 'react-timeago';
import { Comment, CommentBody, Tweet } from '../../typings';
import { fetchComments } from '../lib/fetchComments';

interface Props {
  tweet: Tweet;
}

export default function TweetComponent({ tweet }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);

    setComments(comments);
  };

  useEffect(() => {
    refreshComments();
  }, []);

  // func handle post comment
  const postComment = async () => {
    const commentInfo: CommentBody = {
      comment: input,
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
      username: session?.user?.name || 'Rinaru 404',
      tweetId: tweet._id,
    };

    // send request to mutations
    const res = await fetch(`/api/addComment`, {
      body: JSON.stringify(commentInfo),
      method: 'POST',
    });

    const json = await res.json();

    // refresh the comments
    refreshComments();

    toast('Comment Posted!', {
      icon: '🎉',
    });

    return json;
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    postComment();

    setInput('');
    setCommentBoxVisible(false);
  };

  return (
    <div className='flex flex-col space-x-3 border-y p-5 border-gray-100'>
      <div className='flex space-x-3'>
        <img
          src={tweet.profileImg}
          alt='profile-imgae'
          className='h-10 w-10 rounded-full object-cover'
        />
        <div className=''>
          <div className='flex items-center space-x-1'>
            <p className='mr-1 font-bold'>{tweet.username}</p>
            <p className='hidden text-sm text-gray-500 sm:inline'>
              @{tweet.username.replace(/\s+/g, '').toLowerCase()} •
            </p>

            <ReactTimeago
              date={tweet._createdAt}
              className='text-sm text-gray-500'
            />
          </div>
          <p className='pt-1'>{tweet.text}</p>

          {tweet.image && (
            <img
              src={tweet.image}
              alt='tweet-image'
              className='mt-5 ml-0 max-h-60 rounded-lg object-cover shadow-sm'
            />
          )}
        </div>
      </div>

      <div className='flex justify-between mt-5'>
        <div
          className='flex cursor-pointer items-center space-x-3 text-gray-400'
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
        >
          <ChatAltIcon className='h-5 w-5' />
          <p>{comments && comments.length}</p>
        </div>
        <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
          <SwitchHorizontalIcon className='h-5 w-5' />
        </div>
        <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
          <HeartIcon className='h-5 w-5' />
        </div>
        <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
          <UploadIcon className='h-5 w-5' />
        </div>
      </div>

      {/* comment logic */}

      {commentBoxVisible && (
        <form className='mt-3 flex space-x-3'>
          <input
            type='text'
            placeholder='Write a comment...'
            className='flex-1 rounded-lg bg-gray-100 p-2 outline-none'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className='text-twitter disabled:text-gray-200'
            disabled={!input}
            type='submit'
            onClick={handlerSubmit}
          >
            Post
          </button>
        </form>
      )}

      {comments?.length > 0 && (
        <div className='my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5 scrollbar-hide'>
          {comments.map((comment) => (
            <div key={comment._id} className='flex space-x-2 relative'>
              <hr className='absolute left-5 top-10 h-8 border-x border-twitter/30' />
              <img
                src={comment.profileImg}
                alt={comment.username}
                className='mt-2 h-7 w-7 rounded-full object-cover'
              />
              <div>
                <div className='flex items-center space-x-1'>
                  <p className='mr-1 font-bold'>{comment.username}</p>
                  <p className='hidden text-sm text-gray-500 lg:inline'>
                    @{comment.username.replace(/\s+/g, '').toLowerCase()}
                  </p>
                  <ReactTimeago
                    date={comment._createdAt}
                    className='text-sm text-gray-500'
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
