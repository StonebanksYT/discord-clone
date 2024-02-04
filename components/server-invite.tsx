"use client"
import React from 'react'

interface InvitePageProps {
  handleSubmit: () => void
  servername: string

}

export const ServerInvite = ({handleSubmit,servername}:InvitePageProps) => {
  return (
    <div className='items-center justify-center h-full w-full'>
      <div>
        <h1>Join {servername}</h1>
        <button onClick={handleSubmit}>Join</button>
      </div>
    </div>
  )
}

