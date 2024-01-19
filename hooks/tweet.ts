import { graphqlClient } from "@/clients/api";
import { CreateTweetData, LikeTweetMutation, Tweet } from "@/gql/graphql";
import {
  createTweetMutation,
  likeTweetMutation,
} from "@/graphql/mutation/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphqlClient.request(createTweetMutation, { payload }),
    onMutate: (payload) => toast.loading("Creating Tweet", { id: "1" }),
    onSuccess: async (payload) => {
      await queryClient.invalidateQueries(["all-tweets"]);
      toast.success("Created Success", { id: "1" });
    },
  });

  return mutation;
};

export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => graphqlClient.request(getAllTweetsQuery),
  });
  return { ...query, tweets: query.data?.getAllTweets };
};
type GetAllTweetsResponse = {
  tweets: (Tweet | null)[] | null;
  // ... other properties
};

export const useLikeTweet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (tweetId: string) =>
      graphqlClient.request(likeTweetMutation, { tweetId }),
    onMutate: (tweetId) => {
      // You can perform actions before the mutation occurs (e.g., show loading indicator)
      return tweetId;
    },
    onSuccess: (data, variables, context) => {
      const addedLike = data.likeTweet?.addedLike; // Adjust this based on your actual response structure

      // Update the cache using React Query's queryClient
      queryClient.setQueryData(
        ["all-tweets"],
        (oldData: any) => {
          if (!oldData) return oldData;

          const countModifier = addedLike ? 1 : -1;

          return {
            ...oldData,
            getAllTweets: (oldData.getAllTweets || []).map((tweet: any) => {
              if (tweet?.id === variables) {
                return {
                  ...tweet,
                  likeCount: (tweet.likeCount || 0) + countModifier,
                  likedByMe: !tweet.likedByMe,
                };
              }

              return tweet;
            }),
          };
        }
      );

      // You can perform actions after the mutation is successful
    },
  });

  return mutation;
};
