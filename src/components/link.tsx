import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/layout';
import { default as NextLink } from 'next/link';

export interface LinkProps extends ChakraLinkProps {
  label: string;
  route: string;
};

export const Link: React.FC<LinkProps> = ({ label, children, route, ...props }) => {
  return <NextLink href={route} passHref>
    <ChakraLink aria-label={label} {...props}>{
      children ?? label
    }</ChakraLink>
  </NextLink>;
};
