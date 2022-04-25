import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { withUrqlClient as nextUrqlWithUrqlClient } from 'next-urql';
import { dedupExchange, fetchExchange  } from 'urql';

import {
  UserCreateMutation,
  UserDetailsDocument,
  UserDetailsQuery,
  UserLoginMutation,
  UserLogoutMutation
} from '../../generated/graphql';
import { authenticationErrorExchange } from './exchanges';
import { cursorPagination } from './resolvers';

function updateQuery<ResultT, QueryT>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  updateCallback: (result: ResultT, query: QueryT) => QueryT
) {
  return cache.updateQuery(queryInput, (query) => updateCallback(result, query as any) as any);
}

export function createUrqlClient<SsrExchangeT>(ssrExchange: SsrExchangeT) {
  return {
    url: 'http://localhost:4000/graphql',
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PostListOutput: () => null
        },
        resolvers: {
          Query: {
            postList: cursorPagination()
          }
        },
        updates: {
          Mutation: {
            userCreate: (result, args, cache, info) => {
              // update userDetails when userCreate is called
              updateQuery<UserCreateMutation, UserDetailsQuery>(
                cache,
                { query: UserDetailsDocument },
                result,
                (createResult, userDetailsData) => {
                  return { userDetails: createResult.userCreate };
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
                  return { userDetails: loginResult.userLogin };
                }
              );
            },
            userLogout: (result, args, cache, info) => {
              // update userDetails when userLogout is called
              updateQuery<UserLogoutMutation, UserDetailsQuery>(
                cache,
                { query: UserDetailsDocument },
                result,
                (logoutResult, userDetailsData) => {
                  return { userDetails: null };
                }
              );
            }
          }
        }
      }),
      authenticationErrorExchange,
      ssrExchange,
      fetchExchange
    ],
    fetchOptions: {
      credentials: 'include' as const
    }
  };
}

export const withUrqlClient = nextUrqlWithUrqlClient.bind(nextUrqlWithUrqlClient, createUrqlClient);
