import { NavBar } from '../components';
import { useUserDetailsQuery } from '../generated/graphql';
import { useRouter } from 'next/router';

export const Index: React.FC = () => {
  const [{ data, fetching }] = useUserDetailsQuery();
  const router = useRouter();

  if (!fetching && !data?.userDetails) {
    router.push('/login');
  }

  return (fetching) ? null : <>Hello World!</>;
};

export default Index;
