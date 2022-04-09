import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useUserDetailsQuery } from '../generated/graphql';

export const useAuthenticatedGuard = () => {
  const router = useRouter();
  const [ success, setSuccess ] = useState<boolean | null>(null);
  const [ { data, fetching } ] = useUserDetailsQuery();

  useEffect(() => {
    const newSuccess = (fetching) ? null : data?.userDetails != null;
    if (newSuccess == false) {
      router.push('/login');
    }
    setSuccess(newSuccess);
  }, [ data, fetching, router ]);

  return success;
}
