import React from 'react'

import { TextField } from '@material-ui/core'


function Stats ({ stats: { showed, correct, wrong }}) {
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
  if (!rowData.stats) {
    rowData.stats = { showed: 0, correct: 0, wrong: 0}
  }
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