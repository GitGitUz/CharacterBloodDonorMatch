import React from 'react'
import { useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom';

const GET_CHARACTER = gql`
  query($name: String){
    Character(search: $name){
      id
      name {
        full
        userPreferred
      }
      bloodType
      image{
        medium
      }
    }
  }
`;

export default function Home() {
  const [name, setName] = useState("");
  const[getCharacter, {loading, error, data, called}] = useLazyQuery(GET_CHARACTER, { //getCharacter when called, will execute the query -- essence of lazy query
    variables: {
      name
    }
  })
  console.log({called,loading,error,data,})
  const navigate = useNavigate();
  return (
    <div> 
      <h1>Find a character's blood type</h1>
        <input value={name} onChange={(e) => {
          setName(e.target.value)
          getCharacter()
        }} />
        <button onClick={() =>{
          data && data.Character.bloodType && navigate("/Character", {state:{data}})
        }}>
            Search
        </button>
      {loading && <div>Loading...</div>}
      {error && <div>Character not found</div>}
      {data && (
        <div key={data.Character.id}>
          <img src = {data.Character.image.medium}></img>
          <p>Name: {data.Character.name.full}</p>
          <p>Bloodtype: {data.Character.bloodType? data.Character.bloodType : "UNKNOWN"}</p>
        </div>
      )}
    </div>
  )
}
