import { graphqlClient } from "@/clients/api";
import { getCurrentUserQuery, getLikedStatus } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["curent-user"],
    queryFn: () => graphqlClient.request(getCurrentUserQuery),
  });

  return { ...query, user: query.data?.getCurrentUser };
};

// useLikedStatus hook
export const useLikedStatus = (tweetId: string) => {
  const { data, isLoading, isError } = useQuery(
    ["check-liked-status", tweetId],
    async () => {
      const response = await graphqlClient.request(getLikedStatus, { tweetId });
      return response.getCurrentUser?.liked;
    },

  );

  return { liked: data, isLoading, isError };
};

