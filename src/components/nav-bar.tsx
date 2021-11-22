import { Center, Divider, Stack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { useToast } from '@chakra-ui/toast';

import { useUserDetailsQuery, useUserLogoutMutation } from '../generated/graphql';
import { Link } from './link';

export interface NavBarProps {
};

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [ { fetching: logoutFetching }, logout ] = useUserLogoutMutation();
  const [ { data, fetching: userDetailsFetching } ] = useUserDetailsQuery();
  const toast = useToast();

  let leftNav: JSX.Element | null;
  let rightNav: JSX.Element | null;
  if (userDetailsFetching) {
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
    rightNav = <Button
      isLoading={logoutFetching}
      onClick={async () => {
        await logout();
        toast({ status: 'success', title: 'Logged out' });
      }}
    >Log out</Button>;
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
