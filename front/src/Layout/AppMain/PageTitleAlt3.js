import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';

import TitleComponent3 from './PageTitleAltAction/Variation3'
import PageTitleAction from './PageTitleAltAction/Variation4'

class PageTitleAlt3 extends Component {
    randomize(myArray) {
        return myArray[Math.floor(Math.random() * myArray.length)];
    }

    renderAction(index) {
        switch(index) {
            case 'home':
                return <PageTitleAction />;
            case 'driver':
                return '';
            case 'map':
                return '';
            case 'report':
                return '';
            case 'coaching':
                return '';
            default: return ''
        }
    }

    render() {
        let {
            enablePageTitleIcon,
            heading,
            icon,
        } = this.props;

        return (
            <Fragment>
                <div className="app-page-title app-page-title-simple">
                    <div className="page-title-wrapper">
                        <div className="page-title-heading">
                            <div>
                                <div className="page-title-head center-elem">
                                    <span className={cx("d-inline-block pr-2", {'d-none': !enablePageTitleIcon})}>
                                        <i className={icon}/>
                                    </span>
                                    <span className="d-inline-block">
                                        {heading}
                                    </span>
                                </div>
                                {/* <div
                                    className={cx("page-title-subheading opacity-10", {'d-none': !enablePageTitleSubheading})}>
                                    <TitleComponent3/>
                                </div> */}
                            </div>
                        </div>
                        <div className="page-title-actions">
                            {this.renderAction(this.props.action)}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PageTitleAlt3);