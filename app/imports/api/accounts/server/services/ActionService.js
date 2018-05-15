import _ from "underscore";
import Actions from '/imports/api/actions/collection';
import ReasonCodes from '/imports/api/reasonCodes/collection';
import AccountActions from '/imports/api/accountActions/collection';
import GeneralEnums from '/imports/api/general/enums';
import {StatesSubstates, findStateBySubstate} from '/imports/api/accounts/enums/states.js';
import {Dispatcher, Events} from '/imports/api/events';
import stateEnum from "../..//enums/states";
import {Substates} from "../..//enums/substates";
import Accounts from "../../collection";

export default class ActionService {

    //Adding action to account
    static createAction(data) {
        const {accountId, action: actionId, reasonCode: reasonId, userId, addedBy} = data;
        const action = Actions.findOne({_id: actionId});
        const {inputs} = action;
        const accountActionData = {
            userId,
            actionId,
            reasonCode: reason && reason.reason,
            addedBy
        }
        const customFields = {};
        _.map(inputs, (input) => {
            customFields[input.label] = data[input.label];
        })

        if(!_.isEmpty(customFields)) {
            accountActionData.customFields = customFields;
        }

        const reason = ReasonCodes.findOne({_id: reasonId});

        const accountActionId = AccountActions.insert(accountActionData);
        Accounts.update({_id: accountId}, {
            $set: {
                hasLastSysAction: false
            },
            $push: {
                actionsLinkData: accountActionId
            }
        });
        Dispatcher.emit(Events.ACCOUNT_ACTION_ADDED, {accountId, action});

        this.changeState(accountId, action.substate);

        const actionsSubState = _.flatten([StatesSubstates['Archived'], StatesSubstates['Hold']]);
        const index = _.indexOf(actionsSubState, action.substate);

        if(index > -1) {
            this.removeAssignee(accountId);
        }

    }

    static archive(accountIds, facilityId, fileId) {
        _.map(accountIds, (accountId) => {
            const action = {title: "System archive", substate: Substates.SELF_RETURNED, systemAction: true};
            const actionId = Actions.insert(action);
            const accountActionId = AccountActions.insert({
                actionId,
                fileId,
                systemAction: true
            });

            Accounts.update({acctNum: accountId, state: {$ne: stateEnum.ARCHIVED}, facilityId}, {
                    hasLastSysAction: true,
                    $set: {
                        state: stateEnum.ARCHIVED,
                        substate: Substates.SELF_RETURNED,
                        fileId
                    },
                    $push: {
                        actionsLinkData: accountActionId
                    }
                }
            );
        });
    }

    //Change account state if action have a state
    static changeState(accountId, substate) {

        if (substate && substate !== GeneralEnums.NA) {
            state = findStateBySubstate(StatesSubstates, substate);
            Accounts.update({_id: accountId}, {
                $set: {
                    state,
                    substate
                },
                $unset: {
                    tickleDate: null,
                    escalateReason: null
                }
            });
        }
    }

    static createEscalation({reason, _id, userId}) {
        const actionId = Actions.insert({title: "Escalated", substate: Substates.ESCALATED});
        ActionService.createAction({accountId: _id, actionId, userId});
        Accounts.update({_id}, {
            $set: {
                escalateReason: reason
            }
        })
    }

    static removeAssignee(_id) {
        Accounts.update(
            {_id},
            {
                $unset: {
                    workQueue: null,
                    assigneeId: null
                }
            }
        );
    }
}