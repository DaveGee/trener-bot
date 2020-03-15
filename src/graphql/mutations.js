/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const sendChallengeToUser = /* GraphQL */ `
  mutation SendChallengeToUser($card: CardInput!) {
    sendChallengeToUser(card: $card)
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
    }
  }
`;
