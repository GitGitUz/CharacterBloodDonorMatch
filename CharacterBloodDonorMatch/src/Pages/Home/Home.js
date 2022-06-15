import { React, useState, useEffect } from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
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

const GET_CHARACTERS = gql`
  query($name: String, $page: Int){
    Page(page: $page){
      pageInfo {      
        currentPage
        hasNextPage
      }
      characters(search: $name, sort: FAVOURITES_DESC){
        id
        name {
          userPreferred
        }
        bloodType
        image {
          medium
        }
        media (type: ANIME){
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
  }
`;

export default function Home() {
  //------------old code----------
  // const [name, setName] = useState("");
  // const[getCharacter, {loading, error, data,}] = useLazyQuery(GET_CHARACTER, { //getCharacter when called, will execute the query -- essence of lazy query
  //   variables: {
  //     name
  //   }
  // })
  // console.log({loading,error,data,})
  // const navigate = useNavigate();
  // return (
  //   <div> 
  //     <h1>Find An Anime Character's Possible Blood Donors</h1>
  //       <input value={name} onChange={(e) => {
  //         setName(e.target.value)
  //         getCharacter()
  //       }} />
  //       <button onClick={() =>{
  //                 data && data.Character.bloodType && data.Character.bloodType!== "O Rh-" && navigate("/Character", {state:{data}})
  //               }}>Search
  //       </button>
  //     {loading && <div>Loading...</div>}
  //     {error && <div>Character not found</div>}
  //     {data && (
  //       <div key={data.Character.id}>
  //         <img src = {data.Character.image.medium}></img>
  //         <p>Name: {data.Character.name.userPreferred}</p>
  //         <p>Bloodtype: {data.Character.bloodType? data.Character.bloodType : "UNKNOWN"}</p>
  //         <p>Anime: {mostPopularMedia(data.Character.media.nodes)}</p>
  //       </div>
  //     )}
  //   </div>
  // )

//-----------new code-----------
  const [name, setName] = useState("");
  // const [rerender, setRerender] = useState(false);
  const[getCharacters, {loading, error, data, fetchMore}] = useLazyQuery(GET_CHARACTERS, { //getCharacter when called, will execute the query
    variables: {
      name: name    
    },
    fetchPolicy : 'network-only'
  })
  const navigate = useNavigate();

  // useEffect(()=>{

  //   setRerender(!rerender);

  // }, [rerender]);

  if(loading){return <div>Loading...</div>}
  if(error){return <div>Something Went Wrong</div>}

  console.log(loading, error, data)

  return (
    <div> 
      <h1>Find An Anime Character's Possible Blood Donors</h1>
      <input id='charSearch'/>
      <button onClick={()=> { 
        setName(document.getElementById('charSearch').value)
        getCharacters(name)
        // setRerender(true)
      }}
      >Search</button>
      <hr></hr>
      {data && data.Page.characters.length > 0 && 
        <SearchResults
          compData = {data || []}
          onLoadMore = {()=>
            fetchMore({
              variables: {
                page: data.Page.pageInfo.currentPage+1
              }
              // nextFetchPolicy: 'cache-first'
              
            })
          }
        />
      }
    </div>
    
  )
}

function SearchResults({compData, onLoadMore}){
  console.log(`Data in Component ${compData}`)
  return (
      <div className='searchChars'>
        {compData.Page.characters.map((Character) => {
          return (
            <div key={Character.id}>
              <img src = {Character.image.medium}></img>
              <h2>{Character.name.userPreferred}</h2>
              <p>ID: {Character.id}</p>
              <p>Bloodtype: {Character.bloodType? Character.bloodType : "UNKNOWN"}</p>
              <p>Anime: {mostPopularMedia(Character.media.nodes)}</p>
            </div>
          );
        })}
        <button disabled ={!compData.Page.pageInfo.hasNextPage} onClick={onLoadMore}>Load more...</button>
      </div>
  ); 
}

/*utility function that returns the most popular media of type ANIME a donor is affiliated with
since character has a list of media nodes, and need to only display one, most popular one is sufficient*/
export function mostPopularMedia(mediaList){
  let mostPopularMedia = null;
  let popularity = 0;
  mediaList.forEach(media=>{
    if(media.popularity > popularity){
      popularity = media.popularity
      mostPopularMedia = media;
    }
  })
  // console.log("TITLE:", mostPopularMedia)
  if(mostPopularMedia === null){
    // console.log("No media")
    return 'UNKNOWN'
  }else{
    return (mostPopularMedia.title.english? mostPopularMedia.title.english : mostPopularMedia.title.userPreferred)
  }
}

/*utility function that returns if a queried character is a valid donor for the recipient following blood type rules
only valid donors should be displayed despite query returning all characters page by page
API has no way to filter by bloodtype so have to manually filter */ 
export function isValidDonor(donorBT, recipientBT){

  var usopp = "S Rh+" //special case for Usopp from One Piece because API has his bloodtype wrong

  if(recipientBT === "O" || recipientBT === "S" || usopp.normalize() === recipientBT.normalize()){
    return (donorBT === "O" || donorBT === "S") ? true : false
  }else if(recipientBT === "A" || recipientBT === "X"){
    return (donorBT === "O" || donorBT === "A" || donorBT === "S" || donorBT === "X") ? true : false
  }else if(recipientBT === "B" || recipientBT === "F"){
    return (donorBT === "O" || donorBT === "B" || donorBT === "S" || donorBT === "F") ? true : false
  }else if(recipientBT === "AB" || recipientBT === "XF"){
    return donorBT? true : false
  }else{
    console.log("invalid recipient bloodtype")
    return false
  }
}
