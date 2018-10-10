import React, { Component } from 'react';
import { AutoForm, AutoField, ErrorField, SelectField } from '/imports/ui/forms';
import TagsSchema from '/imports/api/tags/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import TagsList from './TagsList.jsx';

export default class CreateEditTags extends Component {
    constructor () {
        super();

        this.state = {
            cancelDialogActive: false,
            showSpecificRoles: false,
        };
    }

    componentDidMount () {
    }

    dialogToggle = () => {
        const {cancelDialogActive} = this.state;
        this.setState({
            cancelDialogActive: !cancelDialogActive
        });
    };

    onFormChange = (model) => {
        let showSpecificRoles = false;
        if (model.privacy == 'Specific roles') {
            showSpecificRoles = true;
        }
        this.setState({
            showSpecificRoles
        });
    };

    onSubmitForm = (data) => {
        const { user} = this.props;
        data.workQueueStatus=true;
        Meteor.call('tag.create', {data, _id: user._id}, (err) => {
            if (!err) {
                Notifier.success('Tag successfully created!');
                this.refs.tagForm.reset();
            } else {
                Notifier.error(err.reason);
            }
        });
    };

    getOptions = (enums) => {
        return _.map(enums, (value) => {
            return {value: value._id, label: value.clientName};
        })
    };

    render () {
        const {cancelDialogActive} = this.state;
        const {tags, clients} = this.props;

        const clientOptns = this.getOptions(clients);


        return (
            <div>
                <div className="add-filter text-center" onClick={this.dialogToggle}>Manage Tags</div>
                {
                    cancelDialogActive && (
                        <div>
                            <div className="create-form">
                                <div className="create-form__wrapper">
                                    <div className="action-block">

                                        <AutoForm schema={TagsSchema} onChangeModel={this.onFormChange}
                                                  onSubmit={this.onSubmitForm}
                                                  ref="tagForm">

                                            <div className="form-wrapper">
                                                <AutoField labelHidden={true} placeholder="Name" name="name"/>
                                                <ErrorField name="name"/>
                                            </div>

                                            <div className="select-group">
                                                <div className="form-wrapper">
                                                    <SelectField placeholder="Select Client"
                                                                labelHidden={true}
                                                                options={clientOptns}
                                                                name="clientId"/>
                                                    <ErrorField name="clientId"/>
                                                </div>
                                            </div>
                                            <div className="form-wrapper">
                                                <button className="btn--green">Create new tag</button>
                                            </div>
                                        </AutoForm>
                                    </div>
                                </div>
                            </div>
                            <div className="header__block">
                                <div className="title-block text-uppercase">List of available tags</div>
                            </div>
                            <TagsList tags={tags}/>

                        </div>
                    )
                }
            </div>

        );
    }
}