import React, { Component } from "react";
import api from "./api";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import Downshift from "downshift";

class App extends Component {
  state = {
    entries: []
  };

  async componentDidMount() {
    const response = await api.getEntires();
    const data = await response.json();
    console.log(data["@graph"]);
    this.setState({
      entries: data["@graph"].sort((a, b) => {
        var nameA = a.prefLabel.value.toUpperCase(); // ignore upper and lowercase
        var nameB = b.prefLabel.value.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      })
    });
  }

  render() {
    const { entries } = this.state;
    // const content = entries.map(({ prefLabel }) => <li>{prefLabel.value}</li>);
    return (
      <Downshift
        onChange={selection => alert(`You selected ${selection.value}`)}
        itemToString={item => (item ? item.value : "")}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => (
          <div style={{ padding: "42px 32px" }}>
            <label {...getLabelProps()}>Search entries:&nbsp;&nbsp;</label>
            <Input placeholder="Search entries" {...getInputProps()} />
            <br />
            <br />
            <br />
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="stretch"
              spacing={24}
            >
              {entries
                .filter(
                  item =>
                    !inputValue ||
                    item.prefLabel.value.includes(inputValue) ||
                    item.description.value.includes(inputValue)
                )
                .map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    key={item.id + index}
                  >
                    <Card
                      {...getItemProps({
                        index,
                        item,
                        raised:
                          highlightedIndex === index || selectedItem === item,
                        style: { height: "100%" }
                      })}
                    >
                      <CardHeader title={item.prefLabel.value} />
                      <CardContent>{item.description.value}</CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </div>
        )}
      </Downshift>
    );
  }
}

export default App;
//<div className="App">
//  <Input inputTypeSearch placeholder="Search entries" onChange={console.log} />
//  <ul>{content}</ul>
//</div>
