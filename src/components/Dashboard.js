import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";

//Mock data
const data = [
  {
    id: 1,
    label: "Total Photos",
    value: 10
  },
  {
    id: 2,
    label: "Total Topics",
    value: 4
  },
  {
    id: 3,
    label: "User with the most uploads",
    value: "Allison Saeng"
  },
  {
    id: 4,
    label: "User with the least uploads",
    value: "Lukas Souza"
  }
];


class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: []
  };
  // Instance method
  selectPanel(id) {
    this.setState( previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));
    const urlsPromise = [
      "/api/photos", //use this format because proxy has been declared in photolabs API package json
      "/api/topics",
    ].map(url => fetch(url).then(response => response.json()));
    
    Promise.all(urlsPromise)
    .then(([photos, topics]) => {
      this.setState({
        loading: false,
        photos: photos,
        topics: topics
      });
    });

    if (focused) {
      this.setState({ focused });
    }
  };

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    const dashboardClasses = classnames("dashboard", { 
      "dashboard--focused": this.state.focused
    });
    console.log(this.state);
    if (this.state.loading) return < Loading />;
   
    const toggleFocused = (this.state.focused ? data.filter((panel) => this.state.focused === panel.id) : data);

    const panels = toggleFocused.map(panel => (
      <Panel
        key={panel.id}
        label={panel.label}
        value={panel.value}
        onSelect={event => { this.selectPanel(panel.id) } }
      />
    ));

    return (
      <main className={dashboardClasses}>
        {panels}
      </main> 
    );
  }
}

export default Dashboard;