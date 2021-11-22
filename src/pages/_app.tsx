import { ChakraProvider } from '@chakra-ui/react';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { AppProps } from 'next/app';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';

import { NavBar } from '../components';
import {
  UserCreateMutation,
  UserDetailsDocument,
  UserDetailsQuery,
  UserLoginMutation
} from '../generated/graphql';
import { default as theme } from '../theme';
import './app.css';

function updateQuery<ResultT, QueryT>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  updateCallback: (result: ResultT, query: QueryT) => QueryT
) {
  return cache.updateQuery(queryInput, (query) => updateCallback(result, query as any) as any);
}

const client = createClient({
  url: 'http://localhost:4000/graphql',
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        userCreate: (result, args, cache, info) => {
          // update userDetails when userCreate is called
          updateQuery<UserCreateMutation, UserDetailsQuery>(
            cache,
            { query: UserDetailsDocument },
            result,
            (createResult, userDetailsData) => {
              return {
                userDetails: createResult.userCreate
              };
            }
          );
        },
        userLogin: (result, args, cache, info) => {
          // update userDetails when userLogin is called
          updateQuery<UserLoginMutation, UserDetailsQuery>(
            cache,
            { query: UserDetailsDocument },
            result,
            (loginResult, userDetailsData) => {
              return {
                userDetails: loginResult.userLogin
              };
            }
          );
        }
      }
    }
  }), fetchExchange],
  fetchOptions: {
    credentials: 'include'
  }
});

export const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <NavBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
};

export default MyApp;
