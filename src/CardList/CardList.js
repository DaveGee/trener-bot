import React, { useEffect, useCallback } from 'react'
import awsconfig from '../aws-exports'

import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub'

import { 
  createCard, 
  deleteCard as deleteCardMutation, 
  updateCard as updateCardMutation,
  askQuestion
} from '../graphql/mutations'
import { listCards } from '../graphql/queries'

import MaterialTable from 'material-table'

import { editFieldSelector, Stats } from './GridComponents'
import { useCardReducer, QUERY } from './cardReducer'
import QuestionAnswerTwoTone from '@material-ui/icons/QuestionAnswerTwoTone'

API.configure(awsconfig)
PubSub.configure(awsconfig)

const CardList = ({ owner }) => {
  const [state, dispatch] = useCardReducer()
  
  const getData = useCallback(async () => {
    const cardData = await API.graphql(graphqlOperation(listCards, { owner: owner.username }))
    dispatch({ type: QUERY, cards: cardData.data.listCards.items })
  }, [owner.username, dispatch])

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
        actions={[
          {
            icon: () => <QuestionAnswerTwoTone />,
            tooltip: 'Ask!',
            onClick: async (event, rowData) => {
              const result = await API.graphql(graphqlOperation(askQuestion, { card: { id: rowData.id, question: rowData.question, answer: rowData.answer, owner: rowData.owner } }))
              console.log(result)
            }
          }
        ]}
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