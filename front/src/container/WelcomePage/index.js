import React, {Fragment, Component} from 'react';
import { connect } from 'react-redux';
import WelcomeHeader from '../../Layout/WelcomeHeader/';

import background from '../../assets/utils/images/bg.jpg';

class WelcomePages extends React.Component {
    constructor(props) {
        super(props);
        this.props.history.push('/login')
        this.login = this.login.bind(this)
        const { dispatch } = this.props;
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

function mapStateToProps(state) {
  /* const { alert, maps } = state;
  return {
    alert,
    maps
  }; */
}

const connectedWelcomePages = connect()(WelcomePages);
export { connectedWelcomePages as WelcomePage };