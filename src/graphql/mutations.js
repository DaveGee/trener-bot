/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const sendChallengeToUser = /* GraphQL */ `
  mutation SendChallengeToUser($card: CardInput!, $userId: String) {
    sendChallengeToUser(card: $card, userId: $userId)
  }
`;
export const createCard = /* GraphQL */ `
  mutation CreateCard(
    $input: CreateCardInput!
    $condition: ModelCardConditionInput
  ) {
    createCard(input: $input, condition: $condition) {
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
export const updateCard = /* GraphQL */ `
  mutation UpdateCard(
    $input: UpdateCardInput!
    $condition: ModelCardConditionInput
  ) {
    updateCard(input: $input, condition: $condition) {
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
export const deleteCard = /* GraphQL */ `
  mutation DeleteCard(
    $input: DeleteCardInput!
    $condition: ModelCardConditionInput
  ) {
    deleteCard(input: $input, condition: $condition) {
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
