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
import { useCommentTweet, useCreateTweet, useLikeTweet } from "@/hooks/tweet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";

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
  const { user } = useCurrentUser();
  const { liked, isLoading, isError } = useLikedStatus(data?.id);
  // const HeartIcon = liked ? VscHeartFilled : VscHeart;
  const { mutateAsync: likeMutateAsync } = useLikeTweet();
  const { mutateAsync: commentMutateAsync } = useCommentTweet();

  const [isLiked, setIsLiked] = useState(false);
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {}, [isLiked, liked]);

  const handleToggleLike = async (id: string) => {
    // Toggle the like status locally
    // setIsLiked((prevIsLiked) => !prevIsLiked);
    // Use the mutate function from the useLikeTweet hook
    await likeMutateAsync(id);
  };

  const handleCommentForm = () => {
    !user ? toast.error("please login") : setShowCommentForm(true);
  };

  const handleCreateComment = useCallback(
    async (tweetId: string) => {
      if (!content.trim()) {
        // If content is empty, show an error message or take appropriate action
        toast.error("Tweet content cannot be empty");
        return;
      }
      commentMutateAsync({
        content,
        tweetId,
        imageURL: imageURL ? imageURL : null,
      });
      console.log({
        content,
        tweetId,
        imageURL: imageURL ? imageURL : null,
      });

      // await mutateAsync({
      //   content,
      //   imageURL,
      // });
      setContent("");
      setImageURL("");
      setShowCommentForm(false);
    },
    [commentMutateAsync, content, imageURL]
  );

  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
      {showCommentForm && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 bg-opacity-40 p-4 rounded-md shadow-md">
          <Card className="w-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Avatar>
                  {data.user?.profileImageURL && (
                    <AvatarImage src={data.user.profileImageURL} />
                  )}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="ml-10 mt-6 flex flex-col">
                  <Label className=" text-xl">{data.user?.firstName}</Label>
                  <Label className=" text-lg">{data.content}</Label>
                </div>
              </CardTitle>
              <CardDescription className="ml-12 mt-6">
                Replying to {data.user?.firstName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-3.5">
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      placeholder="Post your reply"
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  {/* <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCommentForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => handleCreateComment(data.id)}>
                Reply
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

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
          {/* <p>{data.imageURL}</p> */}
          {data.imageURL && (
            <Image src={data.imageURL} alt="image" width={400} height={400} />
          )}
          <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
            <div className="flex items-center space-x-2">
              <BiMessageRounded onClick={handleCommentForm} />
              <Label>{data.commentCount}</Label>
            </div>
            <div>
              <FaRetweet />
            </div>
            <HeartButton
              onClick={() => handleToggleLike(data.id)}
              isLoading={isLoading}
              liked={data.likedByMe}
              likeCount={data.likeCount}
              authenticated={user ? true : false}
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
