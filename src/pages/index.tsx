import { Button } from '@chakra-ui/button';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text
} from '@chakra-ui/layout';
import { useState } from 'react';

import { Link, Page } from '../components';
import { withUrqlClient } from '../core';
import { usePostListQuery } from '../generated/graphql';

export const Index: React.FC = () => {
  const [ pagination, setPagination ] = useState({
    cursor: null as string | null,
    limit: 10
  });
  const [ { data, fetching } ] = usePostListQuery({ variables: { input: pagination } });

  if (!data && !fetching) {
    return <>Something went wrong while getting posts. Please try again.</>;
  } else if (!data?.postList.length && !fetching) {
    return <>No posts to display. Quick, create a post to be the first!</>;
  }

  return <Page>
    <Flex align="center" marginBottom="2rem">
      <Heading>LiReddit</Heading>
      <Link label="Create Post" marginLeft="auto" route="/create-post">
        Create Post &gt;
      </Link>
    </Flex>
    {(!data) ? (
      <Text>Loading...</Text>
    ) : (
      <Stack spacing="1rem">
        {data.postList.map((post) =>
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
    {(!data) ? null : (
      <Flex align="center" paddingY="1rem">
        <Button
          margin="auto"
          onClick={() => setPagination({
            ...pagination,
            cursor: data.postList[data.postList.length - 1].createdAt
          })}
        >
          Load More
        </Button>
      </Flex>
    )}
  </Page>;
};

export default withUrqlClient()(Index);
