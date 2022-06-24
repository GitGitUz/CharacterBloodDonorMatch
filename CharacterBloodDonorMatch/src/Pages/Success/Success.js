import React from 'react'
import { useLocation } from 'react-router';
import "./Success.css"

export default function Success() {

    const location = useLocation();
    const recipient = location.state
    console.log(recipient)

  return (
    <div>
      Success
    </div>
  )
}
