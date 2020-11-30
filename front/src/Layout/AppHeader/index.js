import React, {Fragment} from 'react';

import {connect} from 'react-redux';
import UserBox from './Components/UserBox';

import HeaderLogo from '../AppLogo';
import actions from './actions'

const Header = ({ user, logout }) => (
    <div className="app-header header-shadow" >

        <HeaderLogo />

        <div className="app-header__content">
            
        </div>
        <div className="app-header-right">
            <UserBox user={user} logout={logout}/>
        </div>
    </div>
  );

function mapStateToProps(state) {
    const { user } = state.authentication;
    return {
        user
    };
}


export default connect(mapStateToProps, actions)(Header);