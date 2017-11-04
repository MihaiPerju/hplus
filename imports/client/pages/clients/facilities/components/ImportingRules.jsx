import React from 'react';
import {AutoForm, AutoField, ErrorField, RadioField} from 'uniforms-unstyled';
import schema from '/imports/api/facilities/schemas/importRulesSchema';
import Notifier from '/imports/client/lib/Notifier';
import PropTypes from 'prop-types';
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class ImportingRules extends React.Component {
    constructor() {
        super();
    }

    onSubmitImportingRules = (importRules) => {
        const facilityId = this.props.model._id;

        Meteor.call('facility.update', {_id: facilityId, importRules}, (err) => {
            if (!err) {
                Notifier.success("Facility updated!");
                FlowRouter.reload();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    getSchemaFields(schemaFields) {
        const fields = [];
        for (let key in schemaFields) {
            if (key != 'hasHeader')
                fields.push(key);
        }
        return fields;
    }

    render() {
        const fields = this.getSchemaFields(schema._schema);
        const {model} = this.props;
        const options = [{value: true, label: 'True'}, {value: false, label: 'False'}];

        return (
            <Container>
                <AutoForm model={model.importRules} schema={schema} onSubmit={this.onSubmitImportingRules}>

                    <RadioField name="hasHeader" options={options}/>
                    <ErrorField name="hasHeader"/>

                    {
                        fields.map((field, index) => {
                            return (
                                <div key={index}>
                                    <AutoField name={field}/>
                                    <ErrorField name={field}/>
                                </div>
                            )
                        })
                    }

                    <Divider/>

                    <Button primary fluid type="submit">Submit</Button>
                </AutoForm>
            </Container>
        )
    }
}

ImportingRules.propTypes = {
    model: PropTypes.object
};