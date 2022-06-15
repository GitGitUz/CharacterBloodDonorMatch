import { React } from 'react'
import { gql, useQuery } from "@apollo/client";
import { useLocation } from 'react-router';
import { mostPopularMedia, isValidDonor } from '../Home/Home';
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

export default function Character() {
  const location = useLocation();
  const {data} = location.state;
  const characterData = data.Character; //need to convert One Piece character bloodtypes to normal 

  return(
    <div>
      <h1>{characterData.name.userPreferred}'s Possible Blood Donors</h1>
      <img src = {characterData.image.medium}></img>
      <p>Bloodtype: {characterData.bloodType}</p>
      <p>Anime: {mostPopularMedia(characterData.media.nodes)}</p>
      <hr></hr>
      {useDonors(characterData)}
    </div> 
  );
}
//-------------INFINITE SCROLL PAGINATION-------------
function useDonors(characterData){
  const { error, loading, data, fetchMore } = useQuery(GET_DONORS, {
    variables: {
      page: 1
    },
  });

  if(loading){return <div>Loading...</div>}
  if(error){return <div>Something Went Wrong</div>}

  console.log(error, loading, data)
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