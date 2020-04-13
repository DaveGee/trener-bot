

let cardCounter = 0
const c = ({
  question = `question ${cardCounter}`,
  answer = `answer ${cardCounter}`,
  showed = 0,
  correct = 0,
  wrong = 0,
  owner = 'x',
  createdAt = new Date().toISOString(),
  id = cardCounter
} = {}) => {
  cardCounter++
  return {
    question,
    answer,
    showed,
    correct,
    wrong,
    createdAt,
    owner,
    id
  }
}

const d = (showed = 0, wrong = 0, correct = 0) => c({ showed, wrong, correct })

exports.smallSet = [
  d(10, 0, 0),
  d(12, 2, 5),
  d(5, 5, 0)
]

exports.initialSet = Array.from(Array(5), () => c())