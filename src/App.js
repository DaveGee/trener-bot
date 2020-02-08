import React, { useReducer, useEffect } from 'react';

import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'

import { createCard } from './graphql/mutations'
import { listCards } from './graphql/queries'
import { onCreateCard } from './graphql/subscriptions'

import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react'
import './App.css';

const QUERY = 'QUERY'
const SUBSCRIPTION = 'SUBSCRIPTION'

const initialState = {
  cards: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return {...state, cards: action.cards}
    case SUBSCRIPTION:
      return {...state, cards: [...state.cards, action.card ]}
    default:
      return state
  }
}

Amplify.configure(awsconfig)
API.configure(awsconfig)
PubSub.configure(awsconfig)

async function createNewCard() {
  const card = { question: 'Coach', answer: 'Trener' }
  await API.graphql(graphqlOperation(createCard, { input: card }))
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function getData() {
      const cardData = await API.graphql(graphqlOperation(listCards))
      dispatch({ type: QUERY, cards: cardData.data.listCards.items })
    }
    getData()

    const subscription = API.graphql(graphqlOperation(onCreateCard)).subscribe({
      next: eventData => {
        const card = eventData.value.data.onCreateCard
        dispatch({ type: SUBSCRIPTION, card })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="App">
      Hello world
      <button onClick={createNewCard}>Add new card</button>
      <div>
        {state.cards.length > 0 ?
          state.cards.map(card => <p key={card.id}>{card.question} - {card.answer}</p>) :
          <p>No card yet!</p>
        }
      </div>
    </div>
  )
}

const signUpConfig = {
  header: 'Choose an email and password',
  hideAllDefaults: true,
  defaultCountryCode: '41',
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password'
    },
    {
      label: 'Name',
      key: 'name',
      required: false,
      displayOrder: 3,
      type: 'string'
    },
  ]
};

export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes: 'email',
})
