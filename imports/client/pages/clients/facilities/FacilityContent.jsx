import React, {Component} from 'react';
import FacilityContentHeader from './components/FacilityContent/FacilityContentHeader';
import ContactTable from './components/FacilityContent/ContactTable';
import PlacementBlock from './components/FacilityContent/PlacementBlock';
import InventoryBlock from './components/FacilityContent/InventoryBlock';
import PaymentBlock from './components/FacilityContent/PaymentBlock';
import FacilityEdit from '/imports/client/pages/clients/facilities/FacilityEdit.jsx';

export default class FacilityContent extends Component {
    constructor(){
        super();
        this.state = {
            edit: false
        }
    }
    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };
    render() {
        const {facility} = this.props;
        const {edit} = this.state;
        return (
            <div className="main-content facility-content">
                <div className="breadcrumb">
                    <ul>
                        <li>
                            <a href={FlowRouter.url('/client/list')}>Clients</a>
                        </li>
                        <li>
                            <span>{facility.name}</span>
                        </li>
                    </ul>
                </div>
                {
                    edit ? <FacilityEdit facility={facility} close={this.setEdit}/> :
                        <div>
                            <FacilityContentHeader onEdit={this.setEdit} facility={facility}/>
                            <ContactTable/>
                            <PlacementBlock facility={facility}/>
                            <InventoryBlock facility={facility}/>
                            <PaymentBlock facility={facility}/>
                        </div>
                }

            </div>
        )
    }
}