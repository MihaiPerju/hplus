import React, {Component} from 'react';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import DatePicker from 'react-datepicker';
import query from '/imports/api/actions/queries/actionList';
import Notifier from '../../../../lib/Notifier';
import reasonCodesQuery from '/imports/api/reasonCodes/queries/reasonCodesList';

const ActionSchema = new SimpleSchema({
    action: {
        type: String,
        optional: true
    },
    reasonCode: {
        type: String,
        optional: true
    }
});

export default class NewAction extends Component {
    constructor() {
        super();
        this.state = {
            fade: false,
            actions: [],
            reasonCodes: [],
            selectedAction: {},
            dateLabelKeys: []
        };
    }

    getActionOptions(actions) {
        return _.map(actions, ({_id, title}) => {
            const value = title;
            return {value: _id, label: value};
        });
    }

    componentWillMount() {
        query.clone().fetch((err, actions) => {
            if (!err) {
                this.setState({
                    actions
                });
            }
        });
    }

    componentWillReceiveProps(props) {
        const {actionId} = this.state;

    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 1);
    }

    getReasonOptions(reasons) {
        return _.map(reasons, ({_id, reason}) => {
            return {value: _id, label: reason};
        });
    }

    onSubmit(data) {
        const {account, hide} = this.props;
        const {dateLabelKeys} = this.state;
        data.accountId = account._id;
        if(account.assignee) {
            data.addedBy = `${account.assignee.profile.firstName} ${account.assignee.profile.lastName}`;
        } else if(account.workQueue) {
            data.addedBy = account.tag.name;
        }

        for(let i = 0; i < dateLabelKeys.length; i++) {
            if(!this.state[dateLabelKeys[i]]) {
                return;
            }
            data[dateLabelKeys[i]] = new Date(this.state[dateLabelKeys[i]]);
        }

        Meteor.call('account.actions.add', data
            , (err) => {
                if (!err) {
                    Notifier.success('Data saved');
                    //Clear inputs
                    this.refs.form.reset();
                    hide();
                } else {
                    Notifier.error(err.reason);
                }
            });
    }

    onHide(e) {
        const {hide} = this.props;
        hide();
    }

    onHandleChange = (field, value) => {
        if (field == 'action') {
            const actionId = value;
            if (actionId) {
                reasonCodesQuery.clone({
                    filters: {
                        actionId: actionId
                    }
                }).fetch((err, reasonCodes) => {
                    if (!err) {
                        this.setState({
                            reasonCodes
                        });
                    }
                });
                this.getAction(actionId);
            }
        }
    };

    getAction = (actionId) => {
        const {actions} = this.state;
        const action = _.filter(actions, (action) => action._id === actionId);
        this.setState({selectedAction: action})
        const {inputs} = action[0] || {};
        const dateLabelKeys = [];
        if(inputs && inputs.length > 0) {
            _.map(inputs, (input) => {
                let {label, type} = input;

                if(type === 'date') {
                    dateLabelKeys.push(label);
                    ActionSchema.extend({
                        [label]: {
                            type: Date,
                            optional: true
                        }
                    });
                } else {
                    type = (type === 'number') ? Number : String;
                    ActionSchema.extend({
                        [label]: {
                            type
                        }
                    });
                }
            })
            this.setState({dateLabelKeys})
        }
    }

    onChange = (date, label) => {
        this.setState({[label]: date});
    }

    renderInputs = (input, index) => {
        if (input.type === "date") {
            return (
                <div className="custom-inputs" key={index}>
                    <DatePicker placeholderText={input.label} selected={this.state[input.label]} onChange={(date) => { this.onChange(date, input.label)}} />
                    {!this.state[input.label] && <div className="alert-notice">{input.label} is required</div>}
                </div>
            );
        }
        return (
            <div className="custom-inputs" key={index}>
                <AutoField labelHidden={true} placeholder={input.label} name={input.label}/>
                <ErrorField name={input.label}/>
            </div>
        );
    }

    render() {
        const {selectedAction} = this.state;
        const actions = this.getActionOptions(this.state.actions);
        const reasonCodes = this.getReasonOptions(this.state.reasonCodes);

        const {inputs} = selectedAction[0] || {};
        const customInputs = _.map(inputs, this.renderInputs)

        return (
            <div className={this.state.fade ? 'new-action in' : 'new-action'}>
                <div className="action-info">
                    <img className="md-avatar img-circle" src="/assets/img/user1.svg" alt=""/>
                    <div className="name">Solomon Ben</div>
                </div>

                <div className="action-form">
                    <AutoForm schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} onChange={this.onHandleChange}
                              ref="form">
                        <div className="select-row">
                            <div className="select-group">
                                <AutoField labelHidden={true} name="action" options={actions}/>
                                <ErrorField name="action"/>
                            </div>
                            {reasonCodes.length > 0 &&
                            <div className="select-group">
                                <AutoField labelHidden={true} name="reasonCode" options={reasonCodes}/>
                                <ErrorField name="reasonCode"/>
                            </div>
                            }
                            <div className="custom-wrapper">
                                {customInputs}
                            </div>
                        </div>
                        <div className="btn-group">
                            <button type="button" className="btn--red" onClick={this.onHide.bind(this)}>Cancel</button>
                            <button type="submit" className="btn--green">Save</button>
                        </div>
                    </AutoForm>
                </div>
            </div>
        );
    }
}