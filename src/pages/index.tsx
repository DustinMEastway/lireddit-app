import { Button } from '@chakra-ui/button';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text
} from '@chakra-ui/layout';
import { CircularProgress } from '@chakra-ui/react';
import { useState } from 'react';

import { Link, Page } from '../components';
import { withUrqlClient } from '../core';
import { usePostListQuery } from '../generated/graphql';

export const Index: React.FC = () => {
  const [ pagination, setPagination ] = useState({
    cursor: null as string | null,
    limit: 10
  });
  const [ { data, fetching, stale } ] = usePostListQuery({ variables: { input: pagination } });
  const posts = data?.postList.items;

  if (!fetching && !data) {
    return <>Something went wrong while getting posts. Please try again.</>;
  } else if (!fetching && !posts?.length) {
    return <>No posts to display. Quick, create a post to be the first!</>;
  }

  let loadItemsElement: JSX.Element | null = null;
  if (!posts || stale) {
    loadItemsElement = <CircularProgress isIndeterminate margin="auto" />;
  } else if (data?.postList.hasMore) {
    loadItemsElement = (
      <Button
        margin="auto"
        onClick={() => setPagination({
          ...pagination,
          cursor: posts[posts.length - 1].createdAt
        })}
      >
        Load More
      </Button>
    );
  }

  return <Page>
    <Flex align="center" marginBottom="2rem">
      <Heading>LiReddit</Heading>
      <Link label="Create Post" marginLeft="auto" route="/create-post">
        Create Post &gt;
      </Link>
    </Flex>
    {(!posts) ? null : (
      <Stack spacing="1rem">
        {posts.map((post) =>
          <Box
            borderWidth="1px"
            key={post.id}
            padding="1rem"
            shadow="md"
          >
            <Heading>{post.title}</Heading>
            <Text
              marginTop="0.5rem"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="pre"
            >
              {post.textSnippet}
            </Text>
          </Box>
        )}
      </Stack>
    )}
    {(!loadItemsElement) ? null : (
      <Flex align="center" paddingY="1rem">
        {loadItemsElement}
      </Flex>
    )}
  </Page>;
};

export default withUrqlClient()(Index);
