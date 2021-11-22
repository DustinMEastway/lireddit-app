import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';

import { default as theme } from '../theme';
import './app.css';

export const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
