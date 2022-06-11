import React from 'react'
import { gql, useQuery } from "@apollo/client";
import { useLocation } from 'react-router';
// import "./AnimeList.css"


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
      <hr></hr>
      {useDonors()}
    </div>
  );

  function useDonors(){
    const { loading, error, data, refetch, fetchMore } = useQuery(GET_DONORS);
  
    console.log(error, loading, data);

    if(loading){return <div>Loading...</div>}
    if(error){return <div>Something Went Wrong</div>}

    if(data.Page.pageInfo.hasNextPage){
      const nextPage = data.Page.pageInfo.currentPage + 1
      console.log(nextPage)
    }

    return (
      <div className='Donors'>
        {data.Page.characters.map((Character) => {
          return (
            Character.bloodType && isValidDonor(Character.bloodType) &&
              <div key={Character.id}>
                <img src = {Character.image.medium}></img>
                <h2>ID: {Character.id}</h2>
                <h3>{Character.name.full}</h3>
                <p>Bloodtype: {Character.bloodType}</p>
              </div>
          );
        })}
      </div>
    );
  }

  function updateQuery(){
  }

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
