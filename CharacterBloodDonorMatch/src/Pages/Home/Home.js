import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Home.css"

export default function Home() {
  const [name, setName] = useState("")
  console.log("Name:",name)
  const navigate = useNavigate();

  return (
    <main className='homebody'>
      <div className='container'> 
        <h1 id='prompt'>Which character needs a blood transfusion?</h1>
        <input id='input' onChange={(e) => setName(e.target.value)}/>
        <button id='searchBtn' onClick={()=> { name !== "" &&
          navigate("/SearchResults", {state:name})
        }}>Search</button>
        <p id='message'>Your favorite anime character's life might be in danger!
           Search for them above and hopefully there are some willing
           blood donors available...</p>
      </div>
    </main>
   
  )  
}

