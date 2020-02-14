import React, { useReducer, useEffect } from 'react'
import awsconfig from '../aws-exports'

import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'

import { createCard, deleteCard, updateCard } from '../graphql/mutations'
import { listCards } from '../graphql/queries'
import { onCreateCard, onDeleteCard, onUpdateCard } from '../graphql/subscriptions'

import TextField from '@material-ui/core/TextField'
import MaterialTable from 'material-table'

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

async function createNewCard(card) {
  return await API.graphql(graphqlOperation(createCard, { input: card }))
}

const CardList = ({ owner }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  useEffect(() => {
    async function getData() {
      const cardData = await API.graphql(graphqlOperation(listCards, { owner: owner.username }))
      dispatch({ type: QUERY, cards: cardData.data.listCards.items })
    }
    getData()

    const deleteSubscription = API.graphql(graphqlOperation(onDeleteCard, { owner: owner.username })).subscribe({
      next: eventData => {
        dispatch({ type: DELETECARD, id: eventData.value.data.onDeleteCard.id })
      }
    })

    const updateSubscription = API.graphql(graphqlOperation(onUpdateCard, { owner: owner.username })).subscribe({
      next: eventData => {
        dispatch({ type: UPDATECARD, card: eventData.value.data.onUpdateCard })
      }
    })

    const createSubscription = API.graphql(graphqlOperation(onCreateCard, { owner: owner.username })).subscribe({
      next: eventData => {
        const card = eventData.value.data.onCreateCard
        dispatch({ type: NEWCARD, card })
      }
    })

    return () => {
      createSubscription.unsubscribe()
      deleteSubscription.unsubscribe()
      updateSubscription.unsubscribe()
    }
  }, [owner])

  return (
    <React.Fragment>
      <MaterialTable
        components={{
          EditField: props => (
            <TextField
              multiline
              rowsMax="8" 
              fullWidth
              value={props.value}
              onChange={e => props.onChange(e.target.value)}
            />
          )
        }}
        editable={{
          isEditable: rowData => true,
          isDeletable: rowData => true,
          onRowAdd: newData => createNewCard(newData),
          onRowUpdate: async (newData, oldData) => await API.graphql(graphqlOperation(updateCard, { input: newData })),
          onRowDelete: async ({ id }) => await API.graphql(graphqlOperation(deleteCard, { input: { id } }))
        }}
        columns={[
          { title: 'Question', field: 'question' },
          { title: 'Answer', field: 'answer' },
          { title: 'Created', field: 'createdAt', type: 'datetime', defaultSort: 'desc', editable: 'never' },
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