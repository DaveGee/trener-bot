


const calculateSuperMemo = (card, quality) => {
  if (quality < 0 || quality > 5) 
    throw "Incorrect quality"


  card.easiness = Math.max(1.3, card.easiness + 0.1 - (5.0 - quality) * (0.08 + (5.0 - quality) * 0.02))
  
  if (quality < 3)
    card.repetitions = 0
  else
    card.repetitions += 1

  if (card.repetitions <= 1)
    card.interval = 1
  else if (card.repetitions === 2)
    card.interval = 6
  else
    card.interval = Math.round(card.interval * card.easiness)

  let millisecondsInDay = 60 * 60 * 24 * 1000
  let now = Date.now()
  card.nextPractice = new Date(now + millisecondsInDay * card.interval)

  return card
}

const defaults = () => ({
  repetitions: 0,
  interval: 1,
  easiness: 2.5
})

const c = calculateSuperMemo

const veryCorrect = c(c(c(c(defaults(), 5), 5), 5), 5)
const veryWrong = c(c(c(c(defaults(), 0), 0), 0), 0)

console.log(veryWrong, veryCorrect)
