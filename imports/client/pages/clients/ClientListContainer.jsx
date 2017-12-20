import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/clients/queries/listClients.js';
import ClientList from './components/ClientList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import SearchInput from "/imports/client/lib/SearchInput.jsx";
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class ClientListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {},
            sortBy: 'none',
            isSortAscend: true
        });

        this.query = query.clone();
        this.ClientListCont = createQueryContainer(this.query, ClientList, {
            reactive: false
        })
    }

    handleSearch = (searchValue) => {
        this.updateFilters({
            filters: {
                clientName: {
                    '$regex': searchValue,
                    '$options': 'i'
                }
            }
        })
    };

    handleHeaderClick = (headerName) => {
        const {sortBy, isSortAscend} = this.state;
        if (sortBy === headerName) {
            this.setState({
                isSortAscend: !isSortAscend
            }, this.handleSort);
        } else {
            this.setState({
                sortBy: headerName,
                isSortAscend: true
            }, this.handleSort);
        }
    };

    handleSort = () => {
        const {sortBy, isSortAscend} = this.state;

        this.updateFilters({
            options: {
                sort: {
                    [sortBy]: isSortAscend ? 1 : -1
                }
            }
        });
    };

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const ClientListCont = this.ClientListCont;
        const {sortBy, isSortAscend} = this.state;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Clients</Header>
                    <SearchInput handleSearch={this.handleSearch}/>
                    
                </div>
                <div className='m-t-30'>
                    {this.getPaginator()}
                    <ClientListCont params={params}
                                    sortBy={sortBy}
                                    isSortAscend={isSortAscend}
                                    handleHeaderClick={this.handleHeaderClick}/>
                    {this.getPaginator()}
                </div>
            </Container>
        );
    }
}