import React from 'react'

function bodycontent(props: { children: React.ReactNode }) {
  return (
    <div>
      {props.children}
    </div>
  )
}

export default bodycontent
