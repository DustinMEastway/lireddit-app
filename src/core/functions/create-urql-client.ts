import { cacheExchange, Cache, Entity, QueryInput } from '@urql/exchange-graphcache';
import { gql } from 'graphql-tag';
import { withUrqlClient as nextUrqlWithUrqlClient } from 'next-urql';
import { dedupExchange, fetchExchange  } from 'urql';

import {
  Post,
  PostDeleteMutation,
  PostDeleteMutationVariables,
  PostSummaryFragment,
  PostSummaryFragmentDoc,
  UpdootVoteMutationVariables,
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
            updootVote: (result, args, cache, info) => {
              const { postId, vote } = (args as UpdootVoteMutationVariables).input;
              const post = cache.readFragment(
                PostSummaryFragmentDoc,
                { id: postId }
              ) as PostSummaryFragment | null;

              if (!post) {
                return;
              }

              post.votes = post.votes + (vote - post.userVote);
              post.userVote = vote;

              cache.writeFragment(gql`
                fragment _ on Post {
                  votes
                  userVote
                }
              `, post);
            },
            postCreate: (_result, _args, cache, _info) => {
              cache.inspectFields('Query').filter((fieldInfo) => {
                return fieldInfo.fieldName === 'postList'
              }).forEach((fieldInfo) => {
                cache.invalidate('Query', 'postList', fieldInfo.arguments);
              });
            },
            postDelete: (result, args, cache, _info) => {
              if (!(result as PostDeleteMutation).postDelete) {
                return;
              }

              const deletedPost: Partial<Post> & Entity = {
                __typename: 'Post',
                id: (args as PostDeleteMutationVariables).input.id
              };

              cache.invalidate(deletedPost);
            },
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
