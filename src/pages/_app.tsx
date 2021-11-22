import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { createClient, Provider } from 'urql';

import { NavBar } from '../components';
import { default as theme } from '../theme';
import './app.css';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  }
});

export const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <NavBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
};

export default MyApp;
