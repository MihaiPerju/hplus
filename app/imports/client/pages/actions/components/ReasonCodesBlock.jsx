import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import { AutoForm, ErrorField, AutoField } from "/imports/ui/forms";
import schema from "/imports/api/reasonCodes/schema";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/reasonCodes/queries/reasonCodesList";

class ReasonCodesBlock extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      clients: [],
      schedule: false,
      blankSchedule: false
    };
  }

  onAddReasonCode = () => {
    this.setState({
      blankSchedule: true
    });
  };

  close = () => {
    this.setState({
      blankSchedule: false
    });
  };

  onDeleteReasonCode = _id => {
    Meteor.call("reasonCode.delete", _id, err => {
      if (!err) {
        Notifier.success("Reason Code removed!");
      } else Notifier.error(err.reason);
    });
  };

  render() {
    const { data, error, loading, action, isPrivate } = this.props;
    const { blankSchedule } = this.state;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    return (
      <div className="action-block reason-code-block">
        <div className="header__block">
          <div className="title-block text-uppercase">
            {isPrivate ? "Private Reason Codes" : "Global Reason Codes"}
          </div>
        </div>
        <div className="main__block">
          <div className="add-content" onClick={this.onAddReasonCode}>
            <i className="icon-calendar-plus-o" />
            <div className="text-center">
              + Add {isPrivate && "Private"} Reason Code
            </div>
          </div>
          {blankSchedule && (
            <CreateReasonCode
              isPrivate={isPrivate}
              close={this.close}
              action={action}
            />
          )}

          <div className="code-list">
            {data.map((reasonCode, index) => {
              return (
                <div key={index} className="code-item">
                  <div className="left__side">
                    <div className="info">
                      <div className="text-light-grey">Reason</div>
                      <div className="info-label">{reasonCode.reason}</div>
                    </div>
                  </div>
                  <div className="btn-group-1">
                    <button
                      onClick={this.onDeleteReasonCode.bind(
                        this,
                        reasonCode._id
                      )}
                      className="btn-cancel"
                    >
                      <i className="icon-trash-o" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

class CreateReasonCode extends Component {
  constructor() {
    super();
  }

  onSubmit = data => {
    const { action, isPrivate } = this.props;
    data.actionId = action._id;
    data.managerId = isPrivate && Meteor.userId();

    Meteor.call("reasonCode.create", data, err => {
      if (!err) {
        Notifier.success("Reason Code created!");
        this.props.close();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  render() {
    const { close, isPrivate } = this.props;
    return (
      <div className="new-section">
        <div className="text-label">
          Create {isPrivate && "Private"} Reason Code
        </div>
        <div className="reason-code-form">
          <AutoForm schema={schema} onSubmit={this.onSubmit} ref="form">
            <div className="form-wrapper">
              <AutoField
                labelHidden={true}
                placeholder="Reason"
                name="reason"
              />
              <ErrorField name="reason" />
            </div>

            <div className="btn-group">
              <button type="button" className="btn-cancel" onClick={close}>
                Cancel
              </button>
              <button className="btn--green">Create</button>
            </div>
          </AutoForm>
        </div>
      </div>
    );
  }
}

export default withQuery(
  props => {
    const { action } = props;
    return query.clone({
      filters: {
        actionId: action._id,
        managerId: props.isPrivate ? Meteor.userId() : null
      }
    });
  },
  { reactive: true }
)(ReasonCodesBlock);