import { React, useEffect, useState, useRef } from 'react'
import { gql, useQuery } from "@apollo/client";
import { useLocation } from 'react-router';
import { mostPopularMedia } from '../Home/Home';
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

// const donors = new Set();

export default function Character() {
  const location = useLocation();
  const {data} = location.state;
  const characterData = data.Character; //need to convert One Piece character bloodtypes to normal 
  // console.log(characterData);
  // console.log("BloodType: ",characterData.bloodType)

  return(
    <div>
      <h1>{characterData.name.userPreferred}'s Possible Blood Donors</h1>
      <img src = {characterData.image.medium}></img>
      <p>Bloodtype: {characterData.bloodType}</p>
      <p>Anime: {mostPopularMedia(characterData.media.nodes).title.english}</p>
      <hr></hr>
      {useDonors(characterData)}
    </div> 
  );
}
//-------------ATTEMPTING INFINITE SCROLL PAGINATION-------------
//custom hook that handles showing the list of possible donors
// function useDonors(characterData){
//   // const [page,setPage] = useState(1)
//   const { error, loading, data, fetchMore } = useQuery(GET_DONORS, {
//     variables: {
//       page:1
//     }  
//   });

//   console.log(error, loading, data)

//   if(loading){return <div>Loading...</div>}
//   if(error){return <div>Something Went Wrong</div>}

//   console.log(`PAGE: ${data.Page.pageInfo.currentPage}`)

//   return (
//     <DonorList
//       data = {data|| []}
//       onLoadMore = {()=>
//         fetchMore({
//           variables: {
//             page: data.Page.pageInfo.currentPage+1
//           },
//         })}
//       characterData = {characterData}
//     />
//   );

  
// }

// function DonorList({data, onLoadMore, characterData}) {
//   console.log("DATA: ", data)
//   // console.log("PAGE: ", page)

//   return (
//     <div className='Donors'>
//       {data.Page.characters.map((Character) => {
//         return (
//           isValidDonor(Character.bloodType,characterData.bloodType) && Character.id !== characterData.id &&
//             <div key={Character.id}>
//               <img src = {Character.image.medium}></img>
//               <h2>{Character.name.userPreferred}</h2>
//               <p>ID: {Character.id}</p>
//               <p>Bloodtype: {Character.bloodType}</p>
//               <p>Anime: {mostPopularMedia(Character.media.nodes).title.english}</p>
//             </div>
//         );
//       })}
//       <button disabled ={!data.Page.pageInfo.hasNextPage} onClick={onLoadMore}>Load more...</button>
//     </div>
//   );
// }

//-------------PAGINATION VIA STATE CHANGE & PREVIOUS/NEXT PAGE BUTTONS-------------
function useDonors(characterData){
  const [page, setPage] = useState(1)
  const { error, loading, data } = useQuery(GET_DONORS, {
    variables: {
      page,
      perPage: 50
    }  
  });

  console.log(error, loading, data)

  if(loading){return <div>Loading...</div>}
  if(error){return <div>Something Went Wrong</div>}

  return (
    <div>
      <DonorList/>
      <button disabled ={data.Page.pageInfo.currentPage<=1} onClick={()=>{ setPage((prev) => prev-1)}}>Page:{data.Page.pageInfo.currentPage>1? data.Page.pageInfo.currentPage-1:""}</button>
      <button disabled ={!data.Page.pageInfo.hasNextPage} onClick={()=>{ setPage((prev) => prev+1)}}>Page: {data.Page.pageInfo.currentPage+1}</button>
    </div>
  );

  function DonorList() {
    console.log("DATA: ", data)
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
                <p>Anime: {mostPopularMedia(Character.media.nodes).title.english}</p>
              </div>
          );
        })}
      </div>
    );
  }
}

//-------------FAKE PAGINATION USING A MASTER SET OF DONORS-------------
// function useDonors(characterData){
//   console.log("NUM DONORS: ",donors.size)
//   const [ page, setPage ] = useState(1)
//   const { loading, error, data } = useQuery(GET_DONORS,{
//     variables:{
//       page
//     }
//   })

//   const btnRef = useRef(null);

//   const scrollToBottom = () => {
//     btnRef.current.scrollIntoView({ behavior: "auto", block: "end" })
//   }
//   useEffect(() => {
//     if(btnRef.current){
//       scrollToBottom()
//     }
//   });

//   console.log(error, loading, data);

//   if(loading){return <div>Loading...</div>}
//   if(error){return <div>Something Went Wrong</div>}

//   /*Faux pagination since AniList GQL API does not support cursor or offset based pagination as specified by the Apollo API documentation
//     Offset based pagination would work but based on schema, merging Page objects not possible due to character id fields not being stritly sequential for a given character[]*/
//   data.Page.characters.forEach(c => { 
//     isValidDonor(c.bloodType,characterData.bloodType) && donors.add(c)
//   });

//   return (
//       <div className='Donors'>
//         {[...donors].map((Character) => {
//           return (
//             Character.id !== characterData.id &&
//               <div key={Character.id}>
//                 <img src = {Character.image.medium}></img>
//                 <h2>{Character.name.userPreferred}</h2>
//                 <p>ID: {Character.id}</p>
//                 <p>Bloodtype: {Character.bloodType}</p>
//                 <p>Anime: {mostPopularMedia(Character.media.nodes).title.english}</p>
//               </div>
//           );
//         })}
//       <button ref={btnRef} disabled ={!data.Page.pageInfo.hasNextPage} onClick={()=>{ setPage((prev) => prev+1)}}>Load more...</button>
//       </div>
//   );
// }

//utility function that returns if a queried character is a valid donor for the recipient following blood type rules
//only valid donors should be displayed despite query returning all characters page by page
//API has no way to filter by bloodtype so have to manually filter 
function isValidDonor(donorBT, recipientBT){
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