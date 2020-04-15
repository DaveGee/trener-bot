module.exports = {
  query: `query CardsByOldest($owner: String, $nextPracticeBefore: String) {
    cardsByOldestPractice(owner: $owner, nextPractice: {lt: $nextPracticeBefore}) {
      items {
        answer
        correct
        easiness
        interval
        id
        nextPractice
        owner
        question
        repetitions
        showed
        wrong
        createdAt
      }
    }
  }`,
}