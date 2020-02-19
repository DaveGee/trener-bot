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

export const useCardReducer = () => 
  useReducer(reducer, initialState)