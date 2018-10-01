import React, {Component} from 'react';
import Notifier from "../../../../../lib/Notifier";
import DropzoneComponent from 'react-dropzone-component';
import ImportingRules from '../ImportingRules';
import {getToken} from "/imports/api/uploads/utils";

export default class InventoryBlock extends Component {

    copyRules = () => {
        const {copyPlacementRules} = this.props;
        copyPlacementRules();
    };

    render() {
        const {facility, resetImportForm, changeResetStatus} = this.props;
        const componentConfig = {
            postUrl: `/uploads/inventory/${facility && facility._id}/${getToken()}`
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            },
            acceptedFiles: '.csv'
        };

        return (
            <div className="action-block drop-file">
                <div className="header__block">
                    <div className="title-block text-uppercase">Inventory File</div>
                </div>
                <div className="main__block">
                    <div className="add-content">
                        <i className="icon-upload"/>
                        <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                    </div>
                    <div className="upload-section">
                        <ImportingRules rules={"inventoryRules"}
                                        model={facility}
                                        resetImportForm={resetImportForm}
                                        changeResetStatus={changeResetStatus}
                                        copyRules={this.copyRules}
                        />
                    </div>
                </div>
            </div>
        )
    }
}