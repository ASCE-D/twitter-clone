import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
  #graphql
  query GetAllTweets {
    getAllTweets {
      likeCount
      commentCount
      likedByMe
      content
      id
      user {
        id
        firstName
        profileImageURL
      }
      imageURL
    }
  }
`);

export const getSignedURLForTweetQuery = graphql(`
  query GetSignedURL($imageName: String!, $imageType: String!) {
    getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
  }
`);
