import { graphql } from "@/gql";

export const createTweetMutation = graphql(`
  #graphql
  mutation CreateTweet($payload: CreateTweetData!) {
    createTweet(payload: $payload) {
      id
    }
  }
`);

export const likeTweetMutation = graphql(`
  #graphql
  mutation LikeTweet($tweetId: ID!) {
    likeTweet(tweetId: $tweetId) {
      addedLike
    }
  }
`);

export const createCommentMutation = graphql(`
  #graphql
  mutation CreateComment($payload: CreateCommentData!) {
    createComment(payload: $payload) {
      id
      content
      imageURL
      userId
    }
  }
`);
