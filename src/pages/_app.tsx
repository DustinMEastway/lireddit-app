import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';

import theme from '../theme';

export const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
