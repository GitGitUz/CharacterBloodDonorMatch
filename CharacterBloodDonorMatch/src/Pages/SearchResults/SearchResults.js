import { React, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
// import "./SearchResults.css"


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
        media{
          nodes {
            type
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

export default function SearchResults() {
  window.onpopstate = () => { //refreshes page and resets cache
    window.location.reload(false);
  }

  const location = useLocation();
  const name = location.state;
  console.log("NAME: ", name)

  return (
    <div>
      <h1>Searched for: {name}</h1>
      {useResults(name)}
    </div>
  )
}

function useResults(name){

  const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: {
      name: name,
      page: 1
    },
    fetchPolicy : 'network-only'
  });

  console.log(loading, error, data)

  if(loading){return <div>Loading...</div>}
  if(error){return <div>Something Went Wrong</div>}

  console.log(`PAGE: ${data.Page.pageInfo.currentPage}`)

  return (
    <ResultList
      data = {data|| []}
      onLoadMore = {()=>
        fetchMore({
          variables: {
            page: data.Page.pageInfo.currentPage+1
          }        
        })
      }
    />
  ); 
}

function ResultList({data, onLoadMore}) {

  const navigate = useNavigate()

  return (
    <div className='Donors'>
      {data.Page.characters.map((Character) => {
        return (
            <div key={Character.id} onClick={() =>{Character.bloodType && Character.bloodType!== "O Rh-" && navigate("/Character", {state:Character})}
            }>
              <img src = {Character.image.medium}></img>
              <h2>{Character.name.userPreferred}</h2>
              <p>ID: {Character.id}</p>
              <p>Bloodtype: {Character.bloodType? Character.bloodType:"UNKNOWN"}</p>
              <p>{mostPopularMedia(Character.media.nodes)}</p>
            </div>
        );
      })}
      <button disabled ={!data.Page.pageInfo.hasNextPage} onClick={onLoadMore}>Load more...</button>
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
    if(mostPopularMedia === null){
        return 'UNKNOWN'
      }else{
        return `${mostPopularMedia.type}: ${mostPopularMedia.title.english? mostPopularMedia.title.english : mostPopularMedia.title.userPreferred}`
      }
}


