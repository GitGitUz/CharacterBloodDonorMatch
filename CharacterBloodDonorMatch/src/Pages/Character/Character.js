import { React, useState, useEffect } from 'react'
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { useLocation } from 'react-router';
import { mostPopularMedia } from '../Home/Home';
// import "./Character.css"


const GET_DONORS = gql`
  query($page: Int){
    Page(page: $page){
      pageInfo {
        currentPage
        hasNextPage
      }
      characters{
        id
        name {
          full
        }
        bloodType
        image {
          medium
        }
        media (type: ANIME){
          nodes {
            id
            title {
              userPreferred
            }
            popularity
          }
        }
      }
    }
  }
`;
export default function Character() {

  const location = useLocation();
  const {data} = location.state;
  const characterData = data.Character; //need to convert One Piece character bloodtypes to normal 
  console.log(characterData);
  console.log("BloodType: ",characterData.bloodType)

  return(
    <div>
      <h1>{characterData.name.full}'s Possible Blood Donors</h1>
      <img src = {characterData.image.medium}></img>
      <p>Bloodtype: {characterData.bloodType}</p>
      <p>Anime: {mostPopularMedia(characterData.media.nodes).title.userPreferred}</p>
      <hr></hr>
      {useDonors()}
    </div>
  );

  function useDonors(){
    const [ page, setPage ] = useState(1)
    const { loading, error, data } = useQuery(GET_DONORS,{
      variables:{
        page
      }
    })
  
    console.log(error, loading, data);

    if(loading){return <div>Loading...</div>}
    if(error){return <div>Something Went Wrong</div>}

    if(data.Page.pageInfo.hasNextPage){
      const currPage = data.Page.pageInfo.currentPage
      console.log("More Pages?",data.Page.pageInfo.hasNextPage)
      console.log("Current Page:", currPage)
      console.log("Next Page:", currPage+1)
    }

    return (
      <div className='Donors'>
        <button disabled={page<=1} onClick = {() => setPage((prev) => prev - 1)}>Previous Page</button>
        <button disabled={!data.Page.pageInfo.hasNextPage}onClick = {() => setPage((prev) => prev + 1)}>Next Page</button>
        {data.Page.characters.map((Character) => {
          return (
            Character.bloodType && isValidDonor(Character.bloodType) && Character.id !== characterData.id &&
              <div key={Character.id}>
                <img src = {Character.image.medium}></img>
                <h2>{Character.name.full}</h2>
                <p>ID: {Character.id}</p>
                <p>Bloodtype: {Character.bloodType}</p>
                <p>Anime: {mostPopularMedia(Character.media.nodes).title.userPreferred}</p>
              </div>
          );
        })}
      </div>
      
    );
  }

  //utility function that returns if a queried character is a valid donor for the recipient following blood type rules
  //only valid donors should be displayed despite query returning all characters page by page
  //API has no way to filter by bloodtype so have to manually filter 
  function isValidDonor(donorBT){
    let recipientBT = characterData.bloodType
    if(recipientBT === "O"){
        return donorBT ==="O" ? true : false
    }else if(recipientBT === "A"){
        return (donorBT ==="O" || donorBT ==="A") ? true : false
    }else if(recipientBT === "B"){
        return (donorBT ==="O" || donorBT ==="B") ? true : false
    }else if(recipientBT === "AB"){
      return donorBT === "AB" ? true : false
    }else{
      console.log("invalid recipient bloodtype")
      return false
    }
  }
}

