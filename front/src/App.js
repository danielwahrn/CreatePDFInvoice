import React from 'react';
import { BrowserRouter } from "react-router-dom";

import MainRoutes from './routes/MainRoutes';
import PrivateRoutes from './routes/PrivateRoute';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      // <PrivateRoutes>
        <BrowserRouter >
          <MainRoutes />
        </BrowserRouter>
      //  </PrivateRoutes>
    );
  }
}

export default App;