import React from 'react'
import { render } from '@testing-library/react'
import App from '../App'
import Header from '../Header'

it('renders App', () => {
  const { asFragment } = render(<App />)
  expect(asFragment()).toMatchSnapshot()
})

it('renders Header', () => {
  const { asFragment } = render(<Header />)
  expect(asFragment()).toMatchSnapshot()
})
