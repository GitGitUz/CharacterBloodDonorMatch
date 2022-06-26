import { React } from 'react'
import { useQuery } from "@apollo/client";
import { useLocation, useNavigate } from 'react-router';
import { mostPopularMedia } from '../SearchResults/SearchResults';
import { onePieceToNormal } from '../SearchResults/SearchResults';
import { GET_DONORS } from '../../Queries/gql';
import NurseJoy from '../../Images/nursejoy2.png'
import "./Donors.css"

export default function Donors() {
  window.onpopstate = () => { //refreshes page and resets cache
    window.location.reload(false);
  }

  const location = useLocation();
  const recipient = location.state;

    return(
      <main className = 'body'>
        <img className='nurseJoy' src={NurseJoy} alt='nurse joy overlay'></img>
        <div className='recipientContainer'>
          <h1 id='header2'>{recipient.name.userPreferred}'s Possible Blood Donors</h1>
          <div className='recip'>
            <img className = 'recipImage' src = {recipient.image.medium} alt='recipient pic'></img>
            <p>Bloodtype: {recipient.bloodType ===  'S'||'X'||'F'||'XF'||(recipient.bloodType.normalize() === "S Rh") ? onePieceToNormal(recipient.bloodType):recipient.bloodType}</p>
            <p>{mostPopularMedia(recipient.media.nodes)}</p>
          </div>
        </div>
        <hr className='hline'></hr>
        {useDonors(recipient)}
      </main> 
    );
}

function useDonors(recipientData){
  const { loading, error, data, fetchMore } = useQuery(GET_DONORS, {
    variables: {
      page: 1
    }
  });

  console.log(loading, error, data)

  if(loading){return <div className='loader'></div>}
  if(error){return <div>Something Went Wrong</div>}

  return (
    <DonorList
      data = {data|| []}
      onLoadMore = {()=>
        fetchMore({
          variables: {
            page: data.Page.pageInfo.currentPage+1
          }        
        })
      }
      characterData = {recipientData}
    />
  ); 
}

function DonorList({data, onLoadMore, characterData}) {
  console.log("Data in DonorList", data)

  const navigate = useNavigate()

  return (
    <div className='donorsContainer'>
      <main className='resultGrid'>
        {data.Page.characters.map((Character) => {
          return (
            isValidDonor(Character.bloodType,characterData.bloodType) && Character.id !== characterData.id &&
              <div className = 'result' key={Character.id} onClick={() => navigate("/SearchResults/Donors/Transfusion", {state:{Character, characterData}})}>
                <img className = 'image' src = {Character.image.medium} alt="character pic"></img>
                <h2>{Character.name.userPreferred}</h2>
                <p>Bloodtype: {Character.bloodType ===  'S'||'X'||'F'||'XF'||(Character.bloodType.normalize() === "S Rh") ? onePieceToNormal(Character.bloodType):Character.bloodType}</p>
                <p>{mostPopularMedia(Character.media.nodes)}</p>
              </div>
          );
        })}
      </main>
      <hr className='hline'></hr>
      {data.Page.pageInfo.hasNextPage && <button id = 'loadBtn' disabled ={!data.Page.pageInfo.hasNextPage} onClick={onLoadMore}>Load more...</button>}
    </div>
  ); 
}

/*utility function that returns if a queried character is a valid donor for the recipient following blood type rules
only valid donors should be displayed despite query returning all characters page by page
API has no way to filter by bloodtype so have to manually filter */ 
function isValidDonor(donorBT, recipientBT){

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