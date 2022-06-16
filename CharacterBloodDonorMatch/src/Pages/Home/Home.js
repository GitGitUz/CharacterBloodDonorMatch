import { React, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import "./Home.css"

export default function Home() {
  const [name, setName] = useState("")
  console.log("Name:",name)
  const navigate = useNavigate();

  return (
    <div> 
      <h1>Find An Anime Character's Possible Blood Donors</h1>
      <input id='charSearch' onChange={(e) => setName(e.target.value)}/>
      <button onClick={()=> { 
        navigate("/SearchResults", {state:name})
      }}>Search</button>
    </div>
  )  
}

