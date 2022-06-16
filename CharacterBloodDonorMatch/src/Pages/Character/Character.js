import { React } from 'react'
import { gql, useQuery } from "@apollo/client";
import { useLocation } from 'react-router';
import { mostPopularMedia } from '../SearchResults/SearchResults';
// import "./Character.css"

const GET_DONORS = gql`
  query($page: Int){
    Page(page: $page){
      pageInfo {      
        currentPage
        perPage
        lastPage
        hasNextPage
      }
      characters(sort: FAVOURITES_DESC){
        id
        name {
          userPreferred
        }
        bloodType
        image {
          medium
        }
        media {
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

export default function Character() {
  const location = useLocation();
  const recipient = location.state;
  console.log("RECIPIENT: ", recipient)

    return(
      <div>
        <h1>{recipient.name.userPreferred}'s Possible Blood Donors</h1>
        <img src = {recipient.image.medium}></img>
        <p>Bloodtype: {recipient.bloodType}</p>
        <p>Anime: {mostPopularMedia(recipient.media.nodes)}</p>
        <hr></hr>
        {useDonors(recipient)}
      </div> 
    );
}
//-------------INFINITE SCROLL PAGINATION-------------
function useDonors(characterData){
  const { loading, error, data, fetchMore } = useQuery(GET_DONORS, {
    variables: {
      page: 1
    },
  });

  console.log(loading, error, data)

  if(loading){return <div>Loading...</div>}
  if(error){return <div>Something Went Wrong</div>}

  console.log(`PAGE: ${data.Page.pageInfo.currentPage}`)

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
      characterData = {characterData}
    />
  ); 
}

function DonorList({data, onLoadMore, characterData}) {
  return (
    <div className='Donors'>
      {data.Page.characters.map((Character) => {
        return (
          isValidDonor(Character.bloodType,characterData.bloodType) && Character.id !== characterData.id &&
            <div key={Character.id}>
              <img src = {Character.image.medium}></img>
              <h2>{Character.name.userPreferred}</h2>
              <p>ID: {Character.id}</p>
              <p>Bloodtype: {Character.bloodType}</p>
              <p>Anime: {mostPopularMedia(Character.media.nodes)}</p>
            </div>
        );
      })}
      <button disabled ={!data.Page.pageInfo.hasNextPage} onClick={onLoadMore}>Load more...</button>
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

//-------------PAGINATION VIA STATE CHANGE & PREVIOUS/NEXT PAGE BUTTONS-------------
// function useDonors(characterData){
//   const [page, setPage] = useState(1)
//   const { error, loading, data } = useQuery(GET_DONORS, {
//     variables: {
//       page,
//       perPage: 50
//     }  
//   });

//   console.log(error, loading, data)

//   if(loading){return <div>Loading...</div>}
//   if(error){return <div>Something Went Wrong</div>}

//   return (
//     <div>
//       <DonorList/>
//       <button disabled ={data.Page.pageInfo.currentPage<=1} onClick={()=>{ setPage((prev) => prev-1)}}>Page:{data.Page.pageInfo.currentPage>1? data.Page.pageInfo.currentPage-1:""}</button>
//       <button disabled ={!data.Page.pageInfo.hasNextPage} onClick={()=>{ setPage((prev) => prev+1)}}>Page: {data.Page.pageInfo.currentPage+1}</button>
//     </div>
//   );

//   function DonorList() {
//     console.log("DATA: ", data)
//     return (
//       <div className='Donors'>
//         {data.Page.characters.map((Character) => {
//           return (
//             isValidDonor(Character.bloodType,characterData.bloodType) && Character.id !== characterData.id &&
//               <div key={Character.id}>
//                 <img src = {Character.image.medium}></img>
//                 <h2>{Character.name.userPreferred}</h2>
//                 <p>ID: {Character.id}</p>
//                 <p>Bloodtype: {Character.bloodType}</p>
//                 <p>Anime: {mostPopularMedia(Character.media.nodes).title.english}</p>
//               </div>
//           );
//         })}
//       </div>
//     );
//   }
// }