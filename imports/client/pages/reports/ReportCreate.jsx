import React, {Component} from 'react';

export default class ReportCreate extends Component {
    constructor () {
        super();
        this.state = {
            filter: false
        };
        this.addFilter = this.addFilter.bind(this);
        this.closeFilter = this.closeFilter.bind(this);
    }

    addFilter() {
        this.setState({
            filter: true
        })
    }

    closeFilter() {
        this.setState({
            filter: false
        })
    }

    render () {
        const { filter } = this.state;

        return (
            <div className="create-form">
                <form action="">
                    <div className="create-form__bar">
                        <button className="btn-add">+ Add report</button>
                        <div className="btn-group">
                            <button className="btn-cancel">Cancel</button>
                            <button className="btn--green">Confirm & save</button>
                        </div>
                    </div>
                    <div className="create-form__wrapper">
                        <div className="action-block">
                            <div className="header__block">
                                <div className="title-block text-uppercase">general data</div>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Report name"/>
                            </div>
                            <div className="check-group">
                                <input type="checkbox" id="c1"/>
                                <label htmlFor="c1">Allow manager role</label>
                            </div>
                        </div>
                        <div className="action-block">
                            <div className="header__block">
                                <div className="title-block text-uppercase">Create fillters for report</div>
                            </div>
                            <div className="label-filter text-light-grey">Extracted filters ()</div>
                        </div>
                        {
                            filter && <FilterGroup close={this.closeFilter}/>
                        }
                        <div className="add-filter text-center" onClick={this.addFilter}>+ Add filter</div>
                    </div>
                </form>
            </div>
        );
    }
}

class FilterGroup extends Component {
    render() {
        const { close } = this.props;

        return (
            <div className="select-group">
                <div className="row-select">
                    <div className="type">Filter 1</div>
                    <div className="btn-delete" onClick={close}>Delete</div>
                </div>
                <div className="form-wrapper">
                    <select name="filter">
                        <option value="">Select filter</option>
                    </select>
                </div>
                <div className="form-wrapper">
                    <select name="filter">
                        <option value="">Name match</option>
                    </select>
                </div>
            </div>
        )
    }
}