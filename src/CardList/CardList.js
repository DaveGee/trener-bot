import React, { useReducer, useEffect, useCallback } from 'react'
import awsconfig from '../aws-exports'

import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'

import { createCard, deleteCard as deleteCardMutation, updateCard as updateCardMutation } from '../graphql/mutations'
import { listCards } from '../graphql/queries'

import MaterialTable from 'material-table'

import { editFieldSelector, Stats } from './GridComponents'

const QUERY = 'QUERY'
const NEWCARD = 'NEWCARD'
const DELETECARD = 'DELETECARD'
const UPDATECARD = 'UPDATECARD'

const initialState = {
  cards: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return { ...state, cards: action.cards }
    case NEWCARD:
      return { ...state, cards: [...state.cards, action.card] }
    case DELETECARD:
      return { ...state, cards: state.cards.reduce((acc, c) => c.id !== action.id ? [...acc, c] : acc, []) }
    case UPDATECARD:
      return { ...state, cards: state.cards.map(c => c.id === action.card.id ? action.card : c) }
    default:
      return state
  }
}

API.configure(awsconfig)
PubSub.configure(awsconfig)

const CardList = ({ owner }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const getData = useCallback(async () => {
    const cardData = await API.graphql(graphqlOperation(listCards, { owner: owner.username }))
    dispatch({ type: QUERY, cards: cardData.data.listCards.items })
  }, [owner.username])

  async function createNewCard({ question, answer }) {
    const newCard = {
      question,
      answer,
      stats: { 
        showed: 0,
        correct: 0,
        wrong: 0
      }
    }
    await API.graphql(graphqlOperation(createCard, { input: newCard }))
    getData()
  }

  async function deleteCard({ id }) {
    await API.graphql(graphqlOperation(deleteCardMutation, { input: { id } }))
    getData()
  }

  async function updateCard (newData, oldData) {
    await API.graphql(graphqlOperation(updateCardMutation, { input: newData }))
    getData()
  }

  useEffect(() => {
    getData()
  }, [owner, getData])

  return (
    <React.Fragment>
      <MaterialTable
        components={{
          EditField: editFieldSelector
        }}
        editable={{
          isEditable: rowData => true,
          isDeletable: rowData => true,
          onRowAdd: createNewCard,
          onRowUpdate: updateCard,
          onRowDelete: deleteCard
        }}
        columns={[
          { title: 'Question', field: 'question' },
          { title: 'Answer', field: 'answer' },
          { title: 'Created', field: 'createdAt', type: 'datetime', defaultSort: 'desc', editable: 'never' },
          { title: 'Stats', field: 'stats', render: Stats }
        ]}
        data={state.cards}
        title="Cards"
        options={{
          actionsColumnIndex: -1
        }}
      />
    </React.Fragment>
  )
}

export default CardList