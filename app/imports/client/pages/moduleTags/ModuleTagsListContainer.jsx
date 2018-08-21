import React, { Component } from "react";
import ModuleTagList from "./components/ModuleTagList";
import ModuleTagSearchBar from "./components/ModuleTagSearchBar";
import PaginationBar from "/imports/client/lib/PaginationBar";
import ModuleTagContent from "./ModuleTagContent";
import ModuleTagCreate from "./ModuleTagCreate";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import moduleTagsQuery from "/imports/api/moduleTags/queries/listModuleTags";
import Loading from "/imports/client/lib/ui/Loading";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import PagerService from "../../lib/PagerService";
import { objectFromArray } from "/imports/api/utils";

class ModuleTagsListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      tagsSelected: [],
      currentTag: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {}
    });
    this.query = moduleTagsQuery;
  }

  componentWillMount() {
    this.nextPage(0);
  }

  showFilterBar() {
    this.setState({
      filter: !this.state.filter
    });
  }

  setTag = _id => {
    const { currentTag } = this.state;

    if (currentTag === _id) {
      this.setState({ currentTag: null });
    } else {
      this.setState({ currentTag: _id, create: false });
    }
  };

  selectTag = _id => {
    const { tagsSelected } = this.state;
    if (tagsSelected.includes(_id)) {
      tagsSelected.splice(tagsSelected.indexOf(_id), 1);
    } else {
      tagsSelected.push(_id);
    }
    this.setState({ tagsSelected });
  };

  createForm = () => {
    this.setState({
      currentTag: false,
      create: true,
      rightSide: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
    this.updatePager();
  };

  deleteAction = () => {
    const { tagsSelected } = this.state;

    Meteor.call("moduleTag.deleteMany", tagsSelected, err => {
      if (!err) {
        Notifier.success("Tags deleted !");
        this.setState({
          tagsSelected: []
        });
      }
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentClient: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  render() {
    const { data, isLoading, error } = this.props;
    const {
      tagsSelected,
      currentTag,
      create,
      range,
      total,
      clients
    } = this.state;
    
    const tag = objectFromArray(data, currentTag);

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }


    return (
      <div className="cc-container">
        <div
          className={
            currentTag || create ? "left__side" : "left__side full__width"
          }
        >
          <ModuleTagSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={tagsSelected.length}
            deleteAction={this.deleteAction}
            hideSort
            hideFilter
          />
          <ModuleTagList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            tagsSelected={tagsSelected}
            selectTag={this.selectTag}
            currentTag={currentTag}
            setTag={this.setTag}
            tags={data}
          />
          <PaginationBar
            create={this.createForm}
            nextPage={this.nextPage}
            module="Tag Modules"
            range={range}
            total={total}
          />
        </div>
        {(currentTag || create) && (
          <RightSide tag={tag} create={create} close={this.closeForm} />
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
    const { fade } = this.state;
    const { tag, create, close } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? <ModuleTagCreate close={close} /> : <ModuleTagContent tag={tag} />}
      </div>
    );
  }
}

export default withQuery(
  props => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(moduleTagsQuery, {
      page,
      perPage,
      filters: {}
    });
  },
  { reactive: true }
)(ModuleTagsListContainer);
