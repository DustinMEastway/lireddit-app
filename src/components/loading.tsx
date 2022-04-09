import React from 'react';

export interface LoadingProps {
  isLoading: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ children, isLoading }) => {
  return <>{(isLoading) ? 'Loading...' : children}</>;
};
