module.exports = {
  mutation: `mutation UpdateCard(
      $card: UpdateCardInput!
    ) {
      updateCard(input: $card) {
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
    }`,
}