import React, { Component } from "react";
import moment from "moment";
import { types, fields } from "/imports/api/reports/enums/reportColumn";

export default class AccountContent extends Component {
  constructor() {
    super();
  }

  getHeaderNames = (header, index) => {
    const { reportColumns } = this.props.report;
    if (header === fields.INSURANCES) {
      return (
        <div key={index}>
          {reportColumns[header].map(insurance => {
            return _.map(insurance, (value, key) => {
              if (value) {
                return (
                  <div
                    style={{
                      width: "32%",
                      float: "left",
                      borderRight: "1px #d7d7d7 solid"
                    }}
                  >
                    {key}
                  </div>
                );
              }
            });
          })}
        </div>
      );
    } else if (header === fields.METADATA) {
      return (
        <div key={index}>
          {_.map(reportColumns[header], (value, key) => {
            if (value) {
              return (
                <div
                  style={{
                    width: "32%",
                    float: "left",
                    borderRight: "1px #d7d7d7 solid"
                  }}
                >
                  {key}
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return <div key={index}>{header}</div>;
    }
  };

  getColumnValues = (columnKeys, account, index) => {
    const { reportColumns } = this.props.report;
    if (columnKeys === "insurances") {
      return (
        <div key={index}>
          {reportColumns[columnKeys].map((insurance, i) => {
            return _.map(insurance, (value, key) => {
              if (value) {
                return (
                  <div
                    style={{
                      width: "32%",
                      float: "left",
                      borderRight: "1px #d7d7d7 solid"
                    }}
                  >
                    {account.insurances[i] && account.insurances[i][key]}
                  </div>
                );
              }
            });
          })}
        </div>
      );
    } else if (columnKeys === "metaData") {
      return (
        <div key={index}>
          {_.map(reportColumns[columnKeys], (value, key) => {
            if (value) {
              return (
                <div
                  style={{
                    width: "32%",
                    float: "left",
                    borderRight: "1px #d7d7d7 solid"
                  }}
                >
                  {account.metaData && account.metaData[key]}
                </div>
              );
            }
          })}
        </div>
      );
    } else if (types.dates.includes(columnKeys)) {
      return (
        <div key={index}>
          {moment(account[columnKeys]).format("MM/DD/YYYY, hh:mm a")}
        </div>
      );
    } else {
      return <div key={index}>{account[columnKeys]}</div>;
    }
  };

  render() {
    const { tableHeader, accounts } = this.props;

    return (
      <div className="table-container">
        <div className="table-row">
          {tableHeader.map((header, index) => {
            return index == 0 ? (
              <div className="table-header truncate text-left table-field table-field--fixed text-light-grey">
                {header}
              </div>
            ) : (
              <div
                key={index}
                className="table-header text-center table-field text-light-grey"
              >
                {this.getHeaderNames(header, index)}
              </div>
            );
          })}
        </div>
        {accounts.map((account, index) => {
          return (
            <div className="table-row" key={index}>
              <div className="table-field table-field--fixed truncate text-center">
                {"Account No." + (index + 1)}
              </div>
              {tableHeader.map((columnKeys, idx) => {
                if (idx > 0) {
                  return (
                    <div
                      key={idx}
                      className="table-field table-field--grey text-center"
                    >
                      {this.getColumnValues(columnKeys, account, idx)}
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  }
}