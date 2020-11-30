import React, {Component, Fragment} from 'react';

import {
    ButtonGroup, Button
} from 'reactstrap';

export default class TitleComponent4 extends Component {

    render() {
        return (
            <Fragment>
                <ButtonGroup size="sm">
                    <Button className="btn-shadow" color="primary">Today</Button>
                    <Button className="btn-shadow" color="primary">Week</Button>
                    <Button className="btn-shadow" color="primary">Month</Button>
                    <Button className="btn-shadow" color="primary">Year</Button>
                </ButtonGroup>

            </Fragment>
        );
    }
}