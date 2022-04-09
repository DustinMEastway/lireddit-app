import { Text } from '@chakra-ui/layout';

import { Link, NavBar } from '../components';
import { withUrqlClient } from '../core';
import { usePostsQuery } from '../generated/graphql';

export const Index: React.FC = () => {
  const [ { data: posts } ] = usePostsQuery();

  return <>
    <NavBar />
    <Link route="/create-post" label="Create Post">
      Create Post &gt;
    </Link>
    {!posts ? <Text>Loading...</Text> : posts.posts.map((post) =>
      <Text key={post.id}>{post.title}</Text>
    )}
  </>;
};

export default withUrqlClient()(Index);
