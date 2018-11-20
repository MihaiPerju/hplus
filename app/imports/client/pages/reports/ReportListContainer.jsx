import React, { Component } from "react";
import ReportList from "./components/ReportList.jsx";
import ReportSearchBar from "./components/ReportSearchBar.jsx";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import ReportContent from "./ReportContent.jsx";
import ReportCreate from "./ReportCreate.jsx";
import { objectFromArray } from "/imports/api/utils";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import ParamsService from "../../lib/ParamsService";
import substatesQuery from "/imports/api/substates/queries/listSubstates";
import TagsListQuery from "/imports/api/tags/queries/listTags";
import { moduleNames } from "/imports/api/tags/enums/tags";

export default class ReportListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      reportsSelected: [],
      currentReport: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      substates: [],
      tags: [],
      reports: []
    });
    this.method = "reports.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);
    const reportId = FlowRouter.getQueryParam("reportId");
    if (reportId) {
      this.setState({
        currentReport: reportId
      });
    }
    substatesQuery
      .clone({
        filters: { status: true }
      })
      .fetch((err, substates) => {
        if (!err) {
          this.setState({ substates });
        }
      });
    this.getTags();

    this.pollingMethod = setInterval(() => {
      this.listReports();
    }, 3000);
  }

  listReports = () => {
    const params = ParamsService.getReportsParams();
    Meteor.call("reports.get", params, (err, reports) => {
      if (!err) {
        this.setState({ reports });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
    if (queryParams.name && queryParams.name == "") {
      this.setPagerInitial();
    }
    if (queryParams.facCode && queryParams.facCode == "") {
      this.setPagerInitial();
    }
    if (queryParams.ptType && queryParams.ptType == "") {
      this.setPagerInitial();
    }
    this.updatePager();
  }

  setPagerInitial = () => {
    this.setState(
      {
        page: 1,
        perPage: 13,
        total: 0
      },
      () => {
        this.nextPage(0);
      }
    );
  };

  setReport = _id => {
    const { currentReport } = this.state;
    // removing reportId from the query when navigating from notification
    FlowRouter.setQueryParams({ reportId: null });
    if (currentReport === _id) {
      this.setState({ currentReport: null });
    } else {
      this.setState({
        currentReport: _id,
        create: false
      });
    }
  };

  selectReport = _id => {
    const { reportsSelected } = this.state;
    if (reportsSelected.includes(_id)) {
      reportsSelected.splice(reportsSelected.indexOf(_id), 1);
    } else {
      reportsSelected.push(_id);
    }
    this.setState({ reportsSelected });
  };

  createForm = () => {
    this.setState({
      currentReport: false,
      create: true
    });
  };

  closeForm = () => {
    this.setState({ create: false });
    this.updatePager();
  };

  deleteAction = () => {
    const { reportsSelected } = this.state;

    Meteor.call("report.deleteMany", reportsSelected, err => {
      if (!err) {
        Notifier.success("Reports deleted !");
        this.setState({
          reportsSelected: []
        });
        this.closeRightPanel();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentReport: null });
  };

  closeRightPanel = () => {
    this.setState({
      create: false,
      currentReport: null
    });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getReportsParams();
    this.recount(queryParams);
  };

  getTags = () => {
    TagsListQuery.clone({
      filters: { entities: { $in: [moduleNames.REPORTS] } }
    }).fetch((err, tags) => {
      if (!err) {
        this.setState({ tags });
      }
    });
  };

  render() {
    const {
      reportsSelected,
      currentReport,
      create,
      total,
      range,
      substates,
      tags,
      reports
    } = this.state;
    const report = objectFromArray(reports, currentReport);

    return (
      <div className="cc-container">
        <div
          className={
            currentReport || create ? "left__side" : "left__side full__width"
          }
        >
          <ReportSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={reportsSelected.length}
            deleteAction={this.deleteAction}
            closeRightPanel={this.closeRightPanel}
            tags={tags}
            hideSort
            hideFilter={false}
          />
          <ReportList
            class={
              this.state.filter
                ? "task-list reports decreased"
                : "task-list reports"
            }
            reportsSelected={reportsSelected}
            selectReport={this.selectReport}
            currentReport={currentReport}
            setReport={this.setReport}
            reports={reports}
            tags={tags}
          />
          <PaginationBar
            module="Report"
            closeForm={this.closeForm}
            create={this.createForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentReport || create) && (
          <RightSide
            close={this.closeForm}
            report={report}
            create={create}
            substates={substates}
            closeRightPanel={this.closeRightPanel}
          />
        )}
      </div>
    );
  }
}

class RightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  render() {
    const { report, create, close, substates, closeRightPanel } = this.props;
    const { fade } = this.state;
    const classes = classNames({
      right__side: true,
      in: fade
    });
    return (
      <div className={classes}>
        {create ? (
          <ReportCreate close={close} substates={substates} />
        ) : (
          <ReportContent
            closeRightPanel={closeRightPanel}
            substates={substates}
            report={report}
          />
        )}
      </div>
    );
  }
}
