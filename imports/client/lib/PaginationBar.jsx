import React, {Component} from 'react';

export default class PaginationBar extends Component {
    constructor() {
        super();
        this.state = {
            tooltip: false
        };
    }

    showTooltip = () => {
        this.setState({
            tooltip: !this.state.tooltip
        })
    }

    closeTooltip = () => {
        this.setState({
            tooltip: false
        })
    }

    render() {
        const {tooltip} = this.state;
        const {create, module} = this.props;
        return (
            <div className="pagination-bar">
                <div className="pagination-bar__wrapper">
                    <div className="left__side text-dark-grey">1-12 <span className="text-light-grey">of</span> 275
                    </div>
                    <div className="btn-group">
                        <button className="btn-prev"><i className="icon-angle-left"/></button>
                        <button className="btn-next"><i className="icon-angle-right"/></button>
                    </div>
                    <div className="toggle-form" onClick={create} onMouseEnter={this.showTooltip}
                         onMouseLeave={this.closeTooltip}>+
                    </div>
                    {tooltip && <Tooltip module={module}/>}
                </div>
            </div>
        )
    }
}

class Tooltip extends Component {
    render() {
        const {module} = this.props;
        return (
            <div className="tooltip">Add {module && module}</div>
        )
    }
}