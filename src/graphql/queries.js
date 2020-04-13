/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCard = /* GraphQL */ `
  query GetCard($id: ID!) {
    getCard(id: $id) {
      id
      question
      answer
      createdAt
      owner
      showed
      correct
      wrong
      repetitions
      interval
      easiness
      nextPractice
    }
  }
`;
export const listCards = /* GraphQL */ `
  query ListCards(
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        question
        answer
        createdAt
        owner
        showed
        correct
        wrong
        repetitions
        interval
        easiness
        nextPractice
      }
      nextToken
    }
  }
`;
