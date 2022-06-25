import { React } from 'react'
import { useQuery } from '@apollo/client'
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { GET_CHARACTERS } from '../../Queries/gql';
import NurseJoy from '../../Images/nursejoy.png'
import "./SearchResults.css"

export default function SearchResults() {
  window.onpopstate = () => { //refreshes page and resets cache
    window.location.reload(false);
  }

  const location = useLocation();
  const name = location.state;

  return (
    <main className='body'>
      <h1 id='header'>Showing results for: "{name}"</h1>
      <hr className='hline'></hr>
      {useResults(name)}
    </main>
  )
}

function useResults(name){

  const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: {
      name: name
    }
  });

  console.log(loading, error, data)

  if(loading){return <div className='loader'></div>}
  if(error){return <div>Something Went Wrong</div>}

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

  
  const nav=((url, data)=>{
    navigate(url, {state:data})
    window.location.reload(false)
  })

  return (
    data.Page.characters.length > 0 ? 
    (<div className='resultsContainer'>
      <img className='nurseJoy' src={NurseJoy} alt='nurse joy overlay'></img>
      <main className='resultGrid'>
        {data.Page.characters.map((Character) => {
          return ( 
              <div className='result' key={Character.id} onClick={() =>{Character.bloodType && Character.bloodType!== "O Rh-" && nav(`${Character.id}`,Character)}}>
                <img className='image' src = {Character.image.medium} alt="character pic"></img>
                <h2>{Character.name.userPreferred}</h2>
                <p>Bloodtype: {Character.bloodType? (Character.bloodType ===  'S'||'X'||'F'||'XF'||(Character.bloodType.normalize() === "S Rh") ? onePieceToNormal(Character.bloodType):Character.bloodType):"UNKNOWN"}</p>
                <p>{mostPopularMedia(Character.media.nodes)}</p>
              </div>
          );
        })}
      </main>
      <hr className='hline'></hr>
      {data.Page.pageInfo.hasNextPage && <button id = 'loadBtn' disabled ={!data.Page.pageInfo.hasNextPage} onClick={onLoadMore}>Load more...</button>}
    </div>) 
    : 
    <div id='noChar'>No character found</div>
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

//utility function that displays One Piece bloodtypes with equivalent bloodtypes
 export function onePieceToNormal(opBloodType){
  var expandedBloodType =  opBloodType === "S" ? "S (O)" : 
                          (opBloodType === "X"? "X (A)" : 
                          (opBloodType === "F"? "F (B)": 
                          (opBloodType === "XF"? "XF (AB)":
                          (opBloodType === "S Rh+"? "S (O)": 
                           opBloodType))))
  return expandedBloodType
 }


