/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCard = /* GraphQL */ `
  subscription OnCreateCard($owner: String!) {
    onCreateCard(owner: $owner) {
      id
      question
      answer
      createdAt
      owner
      stats {
        showed
        correct
        wrong
      }
    }
  }
`;
export const onUpdateCard = /* GraphQL */ `
  subscription OnUpdateCard($owner: String!) {
    onUpdateCard(owner: $owner) {
      id
      question
      answer
      createdAt
      owner
      stats {
        showed
        correct
        wrong
      }
    }
  }
`;
export const onDeleteCard = /* GraphQL */ `
  subscription OnDeleteCard($owner: String!) {
    onDeleteCard(owner: $owner) {
      id
      question
      answer
      createdAt
      owner
      stats {
        showed
        correct
        wrong
      }
    }
  }
`;
