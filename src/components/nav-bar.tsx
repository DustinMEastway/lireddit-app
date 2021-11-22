import { Center, Divider, Stack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Link } from './link';
import { useUserDetailsQuery } from '../generated/graphql';

export interface NavBarProps {
};

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useUserDetailsQuery();

  let leftNav: JSX.Element | null;
  let rightNav: JSX.Element | null;
  if (fetching) {
    leftNav = null;
    rightNav = null;
  } else if (!data?.userDetails) {
    leftNav = <>
      <Link label="Log In" padding="0.5em" route="/login" />
      <Link label="Register" padding="0.5em" route="/register" />
    </>;
    rightNav = null;
  } else {
    leftNav = <Center>Hello, {data.userDetails.username}</Center>;
    rightNav = <Button>Log out</Button>;
  }

  return <>
    <Stack direction="row" justifyContent="space-between" padding="0.5em">
      <Stack direction="row" spacing="0.5em">
        {leftNav}
      </Stack>
      <Stack direction="row" spacing="0.5em">
        {rightNav}
      </Stack>
    </Stack>
    <Divider />
  </>;
};
