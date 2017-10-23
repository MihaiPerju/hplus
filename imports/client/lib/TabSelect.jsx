import React from 'react';
import PropTypes from 'prop-types';

export default class TabSelect extends React.Component {
    constructor() {
        super();
    }

    onChangeActiveTab(index) {
        this.props.onChangeActiveTab(index);
    }

    render() {
        const {options} = this.props;

        return (
            <div>
                {
                    options.map((tab, index) => {
                        return <button key={index}
                                       onClick={this.onChangeActiveTab.bind(this, index)}>{tab.label}</button>
                    })
                }
            </div>
        )
    }
}

TabSelect.propTypes = {
    options: PropTypes.array,
    onChangeActiveTab: PropTypes.func
};