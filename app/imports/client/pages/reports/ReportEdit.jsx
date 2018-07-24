import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import schema from "/imports/api/reports/schema";
import RolesEnum from "/imports/api/users/enums/roles";
import AccountFilterBuilder from "./AccountFilterBuilder";
import Notifier from "/imports/client/lib/Notifier";
import { EJSON } from "meteor/ejson";
import ReportsService from "../../../api/reports/services/ReportsService";
import AddReportColumn from "./AddReportColumn";

export default class ReportEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      hasGeneralInformation: true,
      generalInformation: {},
      filterBuilderData: {},
      components: {},
      filter: false,
      shareReport: false,
      isReportColumn: false
    };
  }

  componentWillMount() {
    this.initializeData(this.props);
  }

  componentWillReceiveProps = props => {
    this.initializeData(props);
  };

  initializeData = props => {
    const { report } = props;
    let components = {};

    for (let field in report.filterBuilderData) {
      field = ReportsService.getInitialField(field);

      components[field] = {
        isActive: true,
        name: field
      };
    }

    const { name, shareReport, filterBuilderData } = report;

    this.setState({
      generalInformation: {
        name
      },
      components,
      filterBuilderData,
      shareReport
    });
  };

  onChange = (field, value) => {
    let { generalInformation } = this.state;

    //Not allowing to pick up filters if we don't have a name
    if (field === "name") {
      if (value) {
        this.setState({
          hasGeneralInformation: true
        });
      } else {
        this.setState({
          hasGeneralInformation: false
        });
      }
    }
    const newInformation = {};
    newInformation[field] = value;
    _.extend(generalInformation, generalInformation, newInformation);
    this.setState({ generalInformation });
  };

  onSubmitFilters(filters, components, filterBuilderData) {
    //Setting state and creating/editing report
    this.setState({
      components,
      filterBuilderData
    });

    const { generalInformation, shareReport } = this.state;
    _.extend(generalInformation, {
      mongoFilters: EJSON.stringify(filters),
      filterBuilderData,
      shareReport
    });

    const { report } = this.props;
    const { _id } = report;
    Meteor.call("report.update", { generalInformation, _id }, err => {
      if (!err) {
        Notifier.success("Report modified!");
        this.onSetEdit();
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onSetEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  finish = () => {
    const filterBuilder = this.refs.filterBuilder;
    const filterForm = filterBuilder.refs.filters;
    filterForm.submit();
  };

  handleShareReport = () => {
    const { shareReport } = this.state;
    this.setState({ shareReport: !shareReport });
  };

  openDialog = () => {
    this.setState({
      isReportColumn: true
    });
  };

  closeDialog = () => {
    this.setState({
      isReportColumn: false
    });
  };

  render() {
    const {
      hasGeneralInformation,
      shareReport,
      generalInformation,
      components,
      filterBuilderData,
      isReportColumn
    } = this.state;
    const { substates, report } = this.props;
    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onSetEdit} className="btn-cancel">
              Cancel
            </button>
            <button onClick={this.finish} className="btn--green">
              Confirm & save
            </button>
          </div>
        </div>

        <div className="create-form__wrapper">
          {/*General data*/}
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">general data</div>
            </div>
            <AutoForm
              onChange={this.onChange}
              ref="generalDataForm"
              schema={schema}
              model={generalInformation}
            >
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Report name"
                  name="name"
                />
                <ErrorField name="name" />
              </div>
              <div className="check-group">
                <input checked={shareReport} type="checkbox" />
                <label onClick={this.handleShareReport}>Share Reports</label>
              </div>
            </AutoForm>
          </div>
          {hasGeneralInformation && (
            <div className="action-block">
              <div className="header__block">
                <div className="title-block text-uppercase">
                  Edit filters for report
                </div>
              </div>
              <AccountFilterBuilder
                onSubmitFilters={this.onSubmitFilters.bind(this)}
                filterBuilderData={filterBuilderData}
                components={components}
                substates={substates}
                ref="filterBuilder"
              />
            </div>
          )}
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">
                Add report column
              </div>
            </div>
            <div className="form-wrapper">
              <button
                style={{
                  background: "#fff",
                  padding: "17px 15px",
                  color: "#333",
                  width: "100%",
                  lineHeight: "1.6rem",
                  borderRadius: "3px",
                  borderBottom: "0"
                }}
                onClick={this.openDialog.bind(this)}
              >
                Add Column
              </button>
            </div>
            {isReportColumn && (
              <AddReportColumn closeDialog={this.closeDialog} report={report}/>
            )}
          </div>
        </div>
      </div>
    );
  }
}
