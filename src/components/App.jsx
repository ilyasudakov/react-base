import React from 'react';
const AppContext = React.createContext();

export const App = () => {
  return (
    <AppContext.Provider
      value={
        {
          //your context state variables go here
        }
      }
    >
      <div>App</div>
    </AppContext.Provider>
  );
};

export default AppContext;
