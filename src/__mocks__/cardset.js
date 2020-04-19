const newCard = ({
  nextPractice = new Date().toISOString(),
  wrong = 0,
  correct = 0,
  showed = 0
}) => ({
  "answer": "older",
  "correct": correct,
  "easiness": 2.5,
  "interval": 1,
  "id": "a25644fa-de2f-48f6-a4dd-353e5ef2cbbd",
  "nextPractice": nextPractice,
  "owner": "user1",
  "question": "older",
  "repetitions": 0,
  "showed": showed,
  "wrong": wrong,
  "createdAt": "2020-04-13T20:22:39.009Z"
})


const nextChallenge1 = newCard({ nextPractice: '2020-03-01' })
exports.set1 = {
  nextChallenge: nextChallenge1,
  mockResult: {
    "data": {
      "cardsByOldestPractice": {
        "items": [
          nextChallenge1,
          newCard({ nextPractice: '2020-04-14T20:22:02.797Z' })
        ]
      }
    }
  }
}

const nextChallenge2 = newCard({ nextPractice: '2020-03-12T05:00:00.000Z' })
exports.set2 = {
  nextChallenge: nextChallenge2,
  mockResult: {
    "data": {
      "cardsByOldestPractice": {
        "items": [
          newCard({ nextPractice: '2020-04-22T22:22:02.797Z' }),
          newCard({ nextPractice: '2020-03-12T20:22:02.797Z' }),
          nextChallenge2,
          newCard({ nextPractice: '2020-04-18' }),
        ]
      }
    }
  }
}

const date3 = '2020-04-18T10:00:00.000Z'
//wrongness = (10-0)/10 = 1
const nextChallenge3 = newCard({ nextPractice: date3, wrong: 10, correct: 0, showed: 10 })
exports.set3 = {
  nextChallenge: nextChallenge3,
  mockResult: {
    "data": {
      "cardsByOldestPractice": {
        "items": [
          //wrongness = (1-4)/10 = -0.3
          newCard({ nextPractice: date3, wrong: 1, correct: 4, showed: 10 }),
          nextChallenge3,
          //wrongness = (100-1)/101 = 0.98
          newCard({ nextPractice: date3, wrong: 100, correct: 1, showed: 101 }),
          newCard({ nextPractice: '2020-05-01' })
        ]
      }
    }
  }
}