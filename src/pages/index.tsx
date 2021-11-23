import { Text } from '@chakra-ui/layout';
import { useRouter } from 'next/router';

import { NavBar } from '../components';
import { withUrqlClient } from '../core';
import { usePostsQuery, useUserDetailsQuery } from '../generated/graphql';

export const Index: React.FC = () => {
  const [ { data, fetching } ] = useUserDetailsQuery();
  const [ { data: posts } ] = usePostsQuery();
  const router = useRouter();

  if (!fetching && !data?.userDetails) {
    router.push('/login');
  }

  return <>
    <NavBar />
    {!posts ? <Text>Loading...</Text> : posts.posts.map((post) =>
      <Text key={post.id}>{post.title}</Text>
    )}
  </>;
};

export default withUrqlClient()(Index);
