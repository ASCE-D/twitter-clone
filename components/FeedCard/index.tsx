import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";
import { useCurrentUser, useLikedStatus } from "@/hooks/user";
// import { IconHoverEffect } from "./IconHoverEffect";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { IconHoverEffect } from "./IconHoverEffect";
import { useCreateTweet, useLikeTweet } from "@/hooks/tweet";


interface FeedCardProps {
  data: Tweet;
}
type HeartButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  liked: boolean | null | undefined;
  likeCount: number | any;
  authenticated: boolean;
};

function HeartButton({
  isLoading,
  onClick,
  liked,
  likeCount,
  authenticated,
}: HeartButtonProps) {
  // const session = useSession();
  const HeartIcon = liked ? VscHeartFilled : VscHeart;

  if (!authenticated) {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        liked
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <IconHoverEffect red>
        <HeartIcon
          className={`transition-colors duration-200 ${
            liked
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  );
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;
  // const { user } = useCurrentUser();
  const { liked, isLoading, isError } = useLikedStatus(data?.id);
  // const HeartIcon = liked ? VscHeartFilled : VscHeart;
  const { mutateAsync } = useLikeTweet();
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {}, [isLiked, liked]);
  

  const handleToggleLike = async(id: string) => {
    // Toggle the like status locally
    // setIsLiked((prevIsLiked) => !prevIsLiked);
    // Use the mutate function from the useLikeTweet hook
    await mutateAsync(id);
  };

  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          {data.user?.profileImageURL && (
            <Image
              className="rounded-full"
              src={data.user?.profileImageURL}
              alt="user-image"
              height={50}
              width={50}
            />
          )}
        </div>
        <div className="col-span-11">
          <h5>
            <Link href={`/${data.user?.id}`}>
              {data.user?.firstName} {data.author?.lastName}
            </Link>
          </h5>
          <p>{data.content}</p>
          {data.profileImageURL && (
            <Image
              src={data.profileImageURL}
              alt="image"
              width={400}
              height={400}
            />
          )}
          <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
            <div>
              <BiMessageRounded />
            </div>
            <div>
              <FaRetweet />
            </div>
            <HeartButton
              onClick={() => handleToggleLike(data.id)}
              isLoading={isLoading}
              liked={data.likedByMe}
              likeCount={data.likeCount}
              authenticated={data.id ? true : false}
            />
            <div>
              <BiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
