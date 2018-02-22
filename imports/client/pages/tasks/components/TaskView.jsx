import React from 'react';
import Loading from '/imports/client/lib/ui/Loading.jsx';
import query from '/imports/api/tasks/queries/taskList';
import TaskDetails from './TaskDetails.jsx';
import DropzoneComponent from 'react-dropzone-component';
import { Divider } from 'semantic-ui-react';
import CommentsListContainer from '/imports/client/pages/comments/CommentsListContainer';
import { getToken } from '/imports/api/s3-uploads/utils';
import SelectActionsContainer from './SelectActionsContainer';
import { AutoForm } from 'uniforms-semantic';
import { Button } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';
import SimpleSchema from 'simpl-schema';

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

export default class TaskView extends React.Component {
    constructor () {
        super();

        this.state = {
            task: null,
            loading: true,
            actionId: false
        };
    }

    componentWillMount () {
        this.getTask();
    }

    getTask = () => {
        const {taskId} = this.props;
        query.clone({filters: {_id: taskId}}).fetchOne((err, task) => {
            if (err) {
                return Notifier.error('Error while getting task!' + err);
            }

            this.setState({
                task,
                taskId: task._id,
                loading: false
            });
        });
    };

    onSubmit = (data) => {
        const {taskId} = this.props;
        data.taskId = taskId;
        Meteor.call('task.actions.add', data
            , (err) => {
                if (!err) {
                    Notifier.success('Data saved');
                    this.getTask();
                    //Clear inputs
                    this.setState({
                        actionId:false
                    });
                    this.refs.form.reset();
                } else {
                    Notifier.error(err.reason);
                }
            });
    };

    onHandleChange = (field, value) => {
        if (field == 'action') {
            const actionId = value.value;
            this.setState({
                actionId
            });
        }
    };

    render () {
        const {loading, task, actionId} = this.state;
        const {taskId} = this.props;
        const componentConfig = {
            postUrl: `/uploads/task-pdf/` + taskId + '/' + getToken()
        };
        const that = this;
        const djsConfig = {
            complete (file) {
                Notifier.success('Added');
                this.removeFile(file);
                that.getTask();
            },
            acceptedFiles: '.pdf'
        };

        if (loading) {
            return <Loading/>;
        } else return (
            <Container>
                <TaskDetails updateTask={this.getTask} task={task}/>
                <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                <Container className="page-container">
                    <Header as="h2" textAlign="center">Add Action</Header>
                    <AutoForm schema={ActionSchema} onSubmit={this.onSubmit} onChange={this.onHandleChange} ref="form">
                        <SelectActionsContainer actionId={actionId}/>
                        <Divider/>

                        <Button primary fluid type="submit">
                            Save
                        </Button>
                    </AutoForm>
                    <Divider/>
                    <CommentsListContainer taskId={task && task._id}/>
                </Container>
            </Container>
        );
    }
}
