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
      updatedAt
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
        updatedAt
      }
      nextToken
    }
  }
`;
export const cardsByOldestPractice = /* GraphQL */ `
  query CardsByOldestPractice(
    $owner: String
    $nextPractice: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    cardsByOldestPractice(
      owner: $owner
      nextPractice: $nextPractice
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        updatedAt
      }
      nextToken
    }
  }
`;
