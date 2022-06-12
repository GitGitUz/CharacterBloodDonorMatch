import { React, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
// import "./Home.css"

const GET_CHARACTER = gql`
  query($name: String){
    Character(search: $name){
      id
      name {
        userPreferred
      }
      bloodType
      image{
        medium
      }
      media(type: ANIME){
        nodes {
          id
          title {
            english
            userPreferred
          }
          popularity
        }
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
      <h1>Find An Anime Character's Possible Blood Donors</h1>
        <input value={name} onChange={(e) => {
          setName(e.target.value)
          getCharacter()
        }} />
        <button onClick={() =>{
                  data && data.Character.bloodType && navigate("/Character", {state:{data}})
                }}>Search
        </button>
      {loading && <div>Loading...</div>}
      {error && <div>Character not found</div>}
      {data && (
        <div key={data.Character.id}>
          <img src = {data.Character.image.medium}></img>
          <p>Name: {data.Character.name.userPreferred}</p>
          <p>Bloodtype: {data.Character.bloodType? data.Character.bloodType : "UNKNOWN"}</p>
          <p>Anime: {mostPopularMedia(data.Character.media.nodes).title.english}</p>
        </div>
      )}
    </div>
  )
}

//utility function that returns the most popular media of type ANIME a donor is affiliated with
//since character has a list of media nodes, and need to only display one, most popular one is sufficient
export function mostPopularMedia(mediaList){
  let mostPopularMedia = null;
  let popularity = 0;
  mediaList.forEach(media=>{
    if(media.popularity > popularity){
      popularity = media.popularity
      mostPopularMedia = media;
    }
  })
  return  mostPopularMedia
}
