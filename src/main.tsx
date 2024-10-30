import { createRoot } from 'react-dom/client'
import './index.scss';
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react';


createRoot(document.getElementById('root')!).render(
  <ChakraProvider disableGlobalStyle={true}>
    <App />
  </ChakraProvider>
)
