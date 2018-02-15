import React, {Component} from 'react';
import TaskContentHeader from './components/TaskContent/TaskContentHeader';
import PayerBlock from './components/TaskContent/PayerBlock';
import ActionBlock from './components/TaskContent/ActionBlock';
import LetterList from './components/TaskContent/LetterList';
import PdfFiles from './components/TaskContent/PdfFiles';
import CommentBlock from '/imports/client/lib/CommentBlock.jsx';

export default class TaskContent extends Component {
    constructor() {
        super();
    }

    render() {
        const {task} = this.props;
        return (
            <div className="main-content">
                <TaskContentHeader task={task}/>
                <PayerBlock task={task}/>
                <ActionBlock task={task}/>
                <LetterList task={task}/>
                <PdfFiles task={task}/>
                <CommentBlock task={task}/>
            </div>
        )
    }
}