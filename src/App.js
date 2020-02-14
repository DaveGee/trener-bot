import React, { useEffect, useState } from 'react'

import { 
  CssBaseline, 
  Container, 
  createMuiTheme, 
  ThemeProvider 
} from '@material-ui/core'

import Header from './Header'
import CardList from './CardList/CardList'

import Amplify, { Auth } from 'aws-amplify'
import awsconfig from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react'

import teal from '@material-ui/core/colors/teal'
import deepOrange from '@material-ui/core/colors/deepOrange'

Amplify.configure(awsconfig)

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: deepOrange,
  },
})

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const user = await Auth.currentAuthenticatedUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Container fixed maxWidth="md">
          <Header />
          {user && <CardList owner={user} />}
        </Container>
      </ThemeProvider>
    </React.Fragment>
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
