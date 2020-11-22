
const calculateSuperMemo = (card, quality) => {
  if (quality < 0 || quality > 5) 
    throw new Error('Incorrect "quality", should be within 0..5')

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

  const millisecondsInDay = 60 * 60 * 24 * 1000
  const now = Date.now()
  card.nextPractice = new Date(now + millisecondsInDay * card.interval).toISOString()

  return card
}

const defaults = () => ({
  repetitions: 0,
  interval: 1,
  easiness: 2.5
})

exports.update = calculateSuperMemo
exports.defaultCard = defaults