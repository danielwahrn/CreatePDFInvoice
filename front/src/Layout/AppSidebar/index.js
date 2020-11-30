import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';

import Nav from '../AppNav/VerticalNavWrapper';
import HeaderLogo from '../AppLogo';

class AppSidebar extends Component {

    state = {};

    toggleMobileSidebar = () => {
        let {enableMobileMenu, setEnableMobileMenu} = this.props;
        setEnableMobileMenu(!enableMobileMenu);
    }

    render() {

        return (
            <Fragment>
                <div className="sidebar-mobile-overlay" onClick={this.toggleMobileSidebar}/>
                <div className="app-sidebar bg-vicious-stance sidebar-shadow sidebar-text-light">
                    <HeaderLogo/>
                        <div className="app-sidebar__inner">
                            <Nav/>
                        </div>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar);