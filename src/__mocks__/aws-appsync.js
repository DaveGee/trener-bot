
let results
function setResults (resultsMock) {
  results = resultsMock
}

let mutate = jest.fn(() => results)
function getMutateFn () {
  return mutate
}

module.exports = {
  __getMutateFn: getMutateFn,
  __setResults: setResults,
  default: function() {
    this.hydrated = () => ({
      mutate
      // mutate: args => ({
      //   data: {
      //     updateCard: {
      //       id: '10974f4b-6110-4b74-918c-ef4531955a9c',
      //       question: 'x',
      //       answer: 'y',
      //       createdAt: '2020-04-15T20:38:40.042Z',
      //       owner: '8f2013b6-8eda-4024-8e58-23be161ca74a',
      //       showed: 2,
      //       correct: 0,
      //       wrong: 0,
      //       repetitions: 0,
      //       interval: 1,
      //       easiness: 2.5,
      //       nextPractice: '2020-04-16T20:38:40.042Z',
      //       __typename: 'Card'
      //     }
      //   }
      // })
    })
  }
}