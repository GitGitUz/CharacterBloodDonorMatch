import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";

const client = new ApolloClient({ //gives Apollo client information about GQL endpoint
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache({
    typePolicies: {
      Page: {
        fields: {
          pageInfo: {
            keyArgs: ["currentPage", "lastPage", "hasNextPage"],
            merge(existing=[], incoming) {
              console.log('EXISTING PI', existing);
              console.log('INCOMING PI', incoming);
              return incoming;
            },
          },
          characters: {
            keyArgs: false,
            merge(existing=[], incoming) {
              console.log('EXISTING CHARS', existing);
              console.log('INCOMING CHARS', incoming);
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  connectToDevTools: true
});

const root = ReactDOM.createRoot(document.getElementById('root')); //establishes connection between Apollo client and React app
root.render(  
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

