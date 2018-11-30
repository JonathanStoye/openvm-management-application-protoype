import React, { Component } from "react";
import api from "./api";

class App extends Component {
  state = {
    entries: []
  };

  async componentDidMount() {
    const response = await api.getEntires();
    const data = await response.json();
    console.log(data["@graph"]);
    this.setState({ entries: data["@graph"] });
  }

  render() {
    const { entries } = this.state;
    const content = entries.map(({ prefLabel }) => <li>{prefLabel.value}</li>);
    return (
      <div className="App">
        <ul>{content}</ul>
      </div>
    );
  }
}

export default App;
