import React, {Fragment} from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import {Button} from 'reactstrap'
import {connect} from 'react-redux';

import HeaderLogo from '../AppLogo';

class WelcomeHeader extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="app-header header-shadow">
                    <HeaderLogo/>

                    <div className="app-header__content">
                        <div className="app-header-left">
                        </div>
                        <div className="app-header-right">
                            <Button color="primary" onClick={(e) => this.props.login()}>Login</Button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeHeader);