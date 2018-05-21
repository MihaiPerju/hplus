import React from "react";
import Pagination from "react-js-pagination";
import PagerService from "./PagerService";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      page: parseInt(FlowRouter.getParam("page")) || 1,
      perPage: 10,
      total: 0,
      filters: {}
    };
  }

  componentDidMount() {
    const queryParams = PagerService.getParams();
    this.handlePageChange(this.state.page, queryParams);
  }

  componentWillReceiveProps(newProps) {
    const queryParams = PagerService.getParams();
    this.updateFilters(queryParams);
  }

  getQuery() {
    return this.query;
  }

  handlePageChange(page, queryParams) {
    this.setState({ page });

    FlowRouter.setParams({ page });

    this.recount(queryParams);
  }

  updateFilters(filters) {
    this.recount(filters);
    this.setState({
      filters,
      page: 1
    });
  }

  recount = queryParams => {
    this.getQuery()
      .clone(queryParams)
      .getCount((err, res) => {
        this.setState({ total: res });
      });
  };

  getPagerOptions() {
    return {
      limit: this.state.perPage,
      skip: this.state.perPage * (this.state.page - 1)
    };
  }

  getPaginator() {
    return (
      this.state.total > this.state.perPage && (
        <Pagination
          activePage={this.state.page}
          itemsCountPerPage={this.state.perPage}
          totalItemsCount={this.state.total}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
        />
      )
    );
  }

  onFilter(ref) {
    return value => {
      let filters = this.state.filters;

      _.extend(filters, {
        [ref]: value
      });

      this.updateFilters(filters);
    };
  }
}
