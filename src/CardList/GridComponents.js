import React from 'react'

import { TextField } from '@material-ui/core'


function Stats ({ showed = 0, correct = 0, wrong = 0 }) {
  return `${showed} - ${correct} - ${wrong}`
}

function editFieldSelector ({
  columnDef: {
    field
  },
  rowData,
  value,
  onChange
}) {
  switch(field) {
    case 'stats':
      return (<Stats {...rowData} />)
    default:
      return (
        <TextField
          multiline
          rowsMax="8" 
          fullWidth
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )
  }
}

export {
  editFieldSelector,
  Stats
}