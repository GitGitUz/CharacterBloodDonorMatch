import React from 'react'
import { useQuery } from "@apollo/client";
import { useLocation } from 'react-router';
// import "./AnimeList.css"

export default function Character() {

  const location = useLocation();
  const { data } = location.state;
  console.log(data);

  return(
    <div>Reached {data.Character.name.full}'s Page</div>
  );
  // const { loading, error, data } = useQuery(GET_AOT);
  // console.log(error, loading, data);
  
  // if(loading){return <div>Loading...</div>}
  // if(error){return <div>Something Went Wrong</div>}

  // return (
  //   <div className='Character'>
  //     {data.Page.media.map((media) => {
  //       return (
  //         <div key={media.id}>
  //           <img src ={media.coverImage.medium}/>
  //           <h2>{media.title.userPreferred}</h2>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}
