import { Text } from '@chakra-ui/layout';

import { Link, Page } from '../components';
import { withUrqlClient } from '../core';
import { usePostsQuery } from '../generated/graphql';

export const Index: React.FC = () => {
  const [ { data: posts } ] = usePostsQuery();

  return <Page>
    <Link route="/create-post" label="Create Post">
      Create Post &gt;
    </Link>
    {!posts ? <Text>Loading...</Text> : posts.posts.map((post) =>
      <Text key={post.id}>{post.title}</Text>
    )}
  </Page>;
};

export default withUrqlClient()(Index);
