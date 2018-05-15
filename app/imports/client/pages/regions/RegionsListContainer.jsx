import React, {Component} from 'react'
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import RegionsList from './components/RegionsList.jsx';
import RegionContent from './RegionContent.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/regions/queries/regionList";
import Loading from '/imports/client/lib/ui/Loading';
import {objectFromArray} from "/imports/api/utils";
import RegionCreate from "./RegionCreate";
import Notifier from '/imports/client/lib/Notifier';

class RegionListContainer extends Component {
    constructor() {
        super();
        this.state = {
            regionsSelected: [],
            currentRegion: null,
            filter: false,
            create: false
        }
    }

    showBtnGroup() {
        this.setState({
            btnGroup: !this.state.btnGroup
        })
    }

    showFilterBar() {
        this.setState({
            filter: !this.state.filter
        })
    }

    setRegion = (_id) => {
        this.closeForm();
        const {currentRegion} = this.state;

        if (currentRegion === _id) {
            this.setState({currentRegion: null});
        } else {
            this.setState({currentRegion: _id, create: false});
        }
    };

    selectRegion = (_id) => {
        const {regionsSelected} = this.state;
        if (regionsSelected.includes(_id)) {
            regionsSelected.splice(regionsSelected.indexOf(_id), 1);
        } else {
            regionsSelected.push(_id);
        }
        this.setState({regionsSelected});
    };

    createForm = () => {
        this.setState({
            currentRegion: false,
            create: true
        })
    };

    closeForm = () => {
        this.setState({
            create: false
        })
    };

    deleteAction = () => {
        const {regionsSelected} = this.state;

        Meteor.call('region.deleteMany', regionsSelected, (err) => {
            if (!err) {
                Notifier.success('Regions deleted !');
                this.closeRightPanel();
            }
        });
    };

    closeRightPanel = () => {
        this.setState({
            create: false,
            currentRegion: null,
        })
    };

    render() {
        const {data, loading, error} = this.props;
        const {regionsSelected, currentRegion, create} = this.state;
        const region = objectFromArray(data, currentRegion);

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={(currentRegion || create) ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={regionsSelected.length} deleteAction={this.deleteAction}/>
                    <RegionsList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        regionsSelected={regionsSelected}
                        selectRegion={this.selectRegion}
                        currentRegion={currentRegion}
                        setRegion={this.setRegion}
                        regions={data}
                    />
                    <PaginationBar
                        module="Region"
                        create={this.createForm}
                        closeForm={this.closeForm}
                    />
                </div>
                {
                    (currentRegion || create) &&
                    <RightSide
                        region={region}
                        create={create}
                        close={this.closeForm}
                    />

                }
            </div>
        );
    }
}

class RightSide extends Component {
    constructor() {
        super();
        this.state = {
            fade: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 300);
    }

    render() {
        const {fade} = this.state;
        const {region, create, close} = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    create ? <RegionCreate close={close}/> : <RegionContent region={region}/>
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone({
        filters: {
            clientId: FlowRouter.current().params.id
        }
    });
}, {reactive: true})(RegionListContainer)