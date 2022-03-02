import React, {Fragment, Component} from 'react';
import { connect } from 'react-redux';
import WelcomeHeader from '../../Layout/WelcomeHeader/';

import background from '../../assets/utils/images/bg.jpg';

class WelcomePages extends React.Component {
    constructor(props) {
        super(props);
        this.props.history.push('/login')
        this.login = this.login.bind(this)
    }

    login() {
        this.props.history.push('/login')
    }

    render() {
        return (
            <div className="app-container app-theme-white fixed-header">
            
                <Fragment>
                    <WelcomeHeader login={this.login}/>
                        <img src={background} className="full_image" />
                </Fragment> 
            </div> 
        );
    }
}

const connectedWelcomePages = connect()(WelcomePages);
export { connectedWelcomePages as WelcomePage };