import { useReducer } from 'react'

const initialState = {
  cards: []
}

export const QUERY = 'QUERY'
export const NEWCARD = 'NEWCARD'
export const DELETECARD = 'DELETECARD'
export const UPDATECARD = 'UPDATECARD'

const reducer = (state, action) => {
  switch (action.type) {
    case QUERY:
      return { ...state, cards: action.cards }
    default:
      return state
  }
}

export const useCardReducer = () => 
  useReducer(reducer, initialState)