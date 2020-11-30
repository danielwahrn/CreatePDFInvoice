import React, {Fragment, Component} from 'react';
import { connect } from 'react-redux';

import PagesRoutes from '../routes/PagesRoutes';
import {AppContainer} from './AppContainer'

class Pages extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
   
  }

    render() {
        return (
        <Fragment>
            <AppContainer>
                <PagesRoutes />
            </AppContainer>
        </Fragment> 
        );
    }
}

export default Pages;