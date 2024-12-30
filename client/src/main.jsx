import { createRoot } from 'react-dom/client';
import './index.css'; 
import App from './App.jsx'; 
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx'; 
import { ClerkProvider } from '@clerk/clerk-react'; 

// Get your Clerk Publishable Key from the environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Throw an error if the Clerk Publishable Key is not found
if (!PUBLISHABLE_KEY) {
  throw new Error('Clerk Publishable Key is missing! Please add it to your .env.local file');
}

// Render the application to the root element
createRoot(document.getElementById('root')).render(
  
  // Wrap the app with ClerkProvider for authentication and BrowserRouter for routing
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      {/* Wrap with AppContextProvider to provide context throughout the app */}
      <AppContextProvider>
        {/* The main application component */}
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </ClerkProvider>
);

