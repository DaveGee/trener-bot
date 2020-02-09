import React from "react";
import { Auth } from 'aws-amplify'

import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}))

async function signOut() {
  await Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

export default () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Trener Bot
      </Typography>
          <Button color="inherit" onClick={signOut}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}