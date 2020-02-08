import React from "react";
import { Auth } from 'aws-amplify'

async function signOut() {
  await Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

export default () => (
  <div>
    Hello world
      <button onClick={signOut}>Signout</button>
  </div>
)