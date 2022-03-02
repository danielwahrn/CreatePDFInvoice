import React, {Fragment} from 'react';

import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';

class AppContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="app-container app-theme-white fixed-header">
                    <AppHeader/>
                    <div className="app-main">
                        <AppSidebar/>
                        <div className="app-main__outer">
                            <div className="app-main__inner">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div> 
            </Fragment> 
        );
    }
}

export default  AppContainer ;