import { useRouter } from 'next/router';

import { NavBar } from '../components';
import { withUrqlClient } from '../core';
import { useUserDetailsQuery } from '../generated/graphql';

export const Index: React.FC = () => {
  const [{ data, fetching }] = useUserDetailsQuery();
  const router = useRouter();

  if (!fetching && !data?.userDetails) {
    router.push('/login');
  }

  return (fetching) ? null : <>
    <NavBar />
    Hello World!
  </>;
};

export default withUrqlClient()(Index);
