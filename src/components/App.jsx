import React from 'react';
const AppContext = React.createContext();
import { Helmet } from 'react-helmet';

export const App = () => {
  return (
    <AppContext.Provider
      value={
        {
          //your context state variables go here
        }
      }
    >
      <div>
        <Helmet>
          <title>My App</title>
          <meta
            name="description"
            content="This is what you want to show as the page content in the Google SERP Listing"
          />
        </Helmet>
        App
      </div>
    </AppContext.Provider>
  );
};

export default AppContext;
