import React, { Component } from "react";
import api from "./api";

class App extends Component {
  async componentDidMount() {
    const response = await api.getEntires();
    const data = await response.json();
    console.log(data["@graph"]);
  }

  render() {
    return <div className="App" />;
  }
}

export default App;
