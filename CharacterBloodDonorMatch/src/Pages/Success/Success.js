import React from 'react'
import { useLocation, useNavigate } from 'react-router';
import Chopper from '../../Images/chopper.png'
import "./Success.css"

export default function Success() {

    const location = useLocation();
    const recipient = location.state
    console.log(recipient)

    const navigate = useNavigate()

    const nav=((url)=>{
      navigate(url)
      window.location.reload(false)
    })

  return (
    <main className='successbody'>
      <div className='successContainer'>
        <h1 id='thanks'>Thanks to your efforts, we were able to find a donor for {recipient.name.userPreferred}!</h1>
        <img className='chopper' src = {Chopper} alt='chopper'></img>
        <p id='gohomeprompt'>(Click the button below to help another character in need)</p>
        <button id='homeBtn' onClick={()=> {nav('/');}}>Home</button>
      </div>
    </main>
  )
}
