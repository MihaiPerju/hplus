import React, { Component } from "react";
import ModuleTagCreate from "../ModuleTagCreate";
import TagContent from "./TagContent";

export default class TagPanel extends Component {
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
    const { fade } = this.state;
    const { tag, create, close } = this.props;
    if (create) {
      return (
        <div className={fade ? "right__side in" : "right__side"}>
          <ModuleTagCreate close={close} />
        </div>
      );
    }
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <TagContent tag={tag} />
      </div>
    );
  }
}
