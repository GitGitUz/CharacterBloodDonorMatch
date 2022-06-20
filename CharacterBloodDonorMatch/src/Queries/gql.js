import { gql } from '@apollo/client'


export const GET_CHARACTERS = gql`
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

export const GET_DONORS = gql`
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
