import React from 'react';

import { Loading } from './loading';
import { NavBar } from './nav-bar';
import { Wrapper, WrapperPropsSize } from './wrapper';
import { useUserDetailsQuery } from '../generated/graphql';

export interface PageProps {
  guards?: (() => boolean | null)[]
  size?: WrapperPropsSize;
};

export const Page: React.FC<PageProps> = ({
  children,
  guards,
  size
}) => {
  const areGuardsPassed = guards?.map((guard) => guard()).every((isPassed) => isPassed) ?? true;
  const [ { fetching: fetchingUser } ] = useUserDetailsQuery();

  return <Loading isLoading={!areGuardsPassed || fetchingUser}>
    <NavBar size={size} />
    <Wrapper size={size}>
      {children}
    </Wrapper>
  </Loading>;
};
