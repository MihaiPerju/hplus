import React from "react";
import Parser from "simple-text-parser";
import CreateLetter from './CreateLetter';
import { Divider } from 'semantic-ui-react'

export default class LetterTemplatePreview extends React.Component {
    tagParser = () => {
        const {parentState} = this.props;
        const parser = new Parser();
        const {letterTemplateBody} = this.props;
        if(!letterTemplateBody) {
            return;
        }

        parser.addRule(/<code>(.*?)<\/code>/g, function(tag) {
            const word = tag.substring(6).slice(0, -7);
            return `${parentState[word] ? parentState[word]: `<code>${word}</code>`}`;
        });

        return parser.render(letterTemplateBody);
    };

    render() {
        const {letterTemplateBody, taskId} = this.props;
        const letterBody = this.tagParser();

        return(
            <div>
                {!!letterTemplateBody && <div dangerouslySetInnerHTML={{__html: letterBody}}/>}
                {letterTemplateBody &&
                    <div>
                        <Divider />
                        <CreateLetter taskId={taskId} letterBody={letterBody}/>
                    </div>
                }
            </div>
        );
    }
}