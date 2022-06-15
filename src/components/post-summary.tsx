import { Button } from '@chakra-ui/button';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Text
} from '@chakra-ui/layout';
import { IconButton } from '@chakra-ui/react';
import { useState } from 'react';

import { useUpdootVoteMutation, PostSummaryFragment } from '../generated/graphql';

export interface PostSummaryProps {
  post: PostSummaryFragment;
}

export const PostSummary: React.FC<PostSummaryProps> = ({ post }) => {
  const [ { fetching: isVoteLoading } , updootVote ] = useUpdootVoteMutation();

  const vote = async (vote: number) => {
    if (vote === post.userVote) {
      return;
    }

    await updootVote({ input: { postId: post.id, vote } });
  };

  return (
    <Box
      borderWidth="1px"
      shadow="md"
    >
      <Box padding="1rem">
        <HStack flexWrap="wrap">
          <Heading as='h3' size='sm'>{post.title}</Heading>
          <Text>Posted by {post.creator.username}</Text>
        </HStack>
        <Text
          marginTop="0.5rem"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="pre"
        >
          {post.textSnippet}
        </Text>
      </Box>
      <Flex
        align="center"
        justifyContent="right"
        experimental_spaceX=".5rem"
        padding="1rem"
        paddingTop="0"
      >
        <IconButton
          aria-label="Vote Up"
          icon={<ArrowUpIcon />}
          isLoading={isVoteLoading}
          onClick={() => vote(1)}
          variant={(post.userVote === 1) ? 'solid' : 'outline'}
        />
        <Text>{post.votes}</Text>
        <IconButton
          aria-label="Vote Down"
          icon={<ArrowDownIcon />}
          isLoading={isVoteLoading}
          onClick={async () => vote(-1)}
          variant={(post.userVote === -1) ? 'solid' : 'outline'}
        />
      </Flex>
    </Box>
  );
};