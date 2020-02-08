import React from 'react'
import Header from './Header'
import CardList from './CardList'

import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react'
import './App.css';

Amplify.configure(awsconfig)

function App() {
  return (
    <div className="App">
      <Header />
      <CardList />
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
