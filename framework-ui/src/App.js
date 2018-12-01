import React, { Fragment, Component } from "react";
import api from "./api";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Downshift from "downshift";

class App extends Component {
  state = {
    entries: [],
    referenceTypes: []
  };

  async componentDidMount() {
    const getEntiresResponse = await api.getEntires();
    const getEntiresData = await getEntiresResponse.json();
    this.setState(
      {
        entries: getEntiresData["@graph"].sort((a, b) => {
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
      },
      () =>
        this.selectItem(
          getEntiresData["@graph"][Math.floor(Math.random() * 32) + 0]
        )
    );
    const getReferenceTypesResponse = await api.getReferenceTypes();
    const getReferenceTypesData = await getReferenceTypesResponse.json();
    this.setState({
      referenceTypes: getReferenceTypesData["@graph"].sort((a, b) => {
        var nameA = a.label.toUpperCase(); // ignore upper and lowercase
        var nameB = b.label.toUpperCase(); // ignore upper and lowercase
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
    console.log(getReferenceTypesData["@graph"]);
  }

  stateReducer = (state, changes) => {
    // console.log(state);
    // console.log(changes);
    // console.log(changes.type);
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          inputValue: state.inputValue,
          isOpen: !changes.isOpen
        };
      case Downshift.stateChangeTypes.mouseUp:
        return state;
      default:
        return changes;
    }
  };

  render() {
    const { entries, referenceTypes } = this.state;
    return (
      <Downshift
        defaultIsOpen={true}
        itemToString={item => (item ? item.prefLabel.value : "")}
        stateReducer={this.stateReducer}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          inputValue,
          highlightedIndex,
          selectedItem,
          isOpen,
          closeMenu,
          selectItem
        }) => (
          <div style={{ padding: "42px 36px" }}>
            {(this.selectItem = selectItem)}
            <label {...getLabelProps()}>Search entries:&nbsp;&nbsp;</label>
            <Input {...getInputProps({ placeholder: "Search entries" })} />
            <br />
            <br />
            <br />
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="stretch"
              spacing={24}
              {...getMenuProps()}
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
                    {...getItemProps({
                      item,
                      key: item.prefLabel.value + index
                    })}
                  >
                    <Card
                      {...getItemProps({
                        index,
                        item,
                        raised:
                          highlightedIndex === index || selectedItem === item,
                        style: {
                          height: "100%",
                          cursor: "pointer"
                        }
                      })}
                    >
                      <CardHeader title={item.prefLabel.value} />
                      <CardContent>{item.description.value}</CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Modal open={isOpen} disablePortal={true}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh"
                }}
                onClick={closeMenu}
              >
                {selectedItem &&
                  (() => {
                    const {
                      id,
                      skillType,
                      skillReuseLevel,
                      prefLabel,
                      altLabel,
                      description,
                      ...rest
                    } = selectedItem;
                    let references = [];
                    for (let referenceKey in rest) {
                      const referenceTitle = referenceTypes.reduce(
                        (prev, { key, label }) =>
                          key === referenceKey ? label : prev,
                        ""
                      );
                      const referenceTitleUpperFirst =
                        referenceTitle.charAt(0).toUpperCase() +
                        referenceTitle.substr(1);
                      let referenceItems =
                        typeof rest[referenceKey] === "string"
                          ? [rest[referenceKey]]
                          : rest[referenceKey];
                      if (referenceItems.length > 0) {
                        references.push(
                          <ExpansionPanel>
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                            >
                              <Typography>
                                {referenceTitleUpperFirst}
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              <List dense>
                                {referenceItems.map(id => (
                                  <ListItem>
                                    <a href={`?entry=${id.toLowerCase()}`}>
                                      {id.toLowerCase()}
                                    </a>
                                  </ListItem>
                                ))}
                              </List>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        );
                      }
                    }
                    return (
                      <Card
                        onClick={e => e.stopPropagation()}
                        style={{ padding: "18px 12px", maxWidth: 420 }}
                      >
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Type: {skillType}
                          </Typography>
                          <Typography variant="h6" component="h2">
                            {prefLabel.value}
                          </Typography>
                          <Chip
                            label={"Language: " + prefLabel.language}
                            style={{ margin: "3px 7px 18px -1px", height: 22 }}
                          />
                          <Chip
                            label={"Reuse: " + skillReuseLevel.substr(2)}
                            style={{ margin: "3px 7px 18px -1px", height: 22 }}
                          />
                          <Typography variant="subtitle1">
                            Description:
                          </Typography>
                          <Typography paragraph gutterBottom>
                            {description.value}
                          </Typography>
                          {references}
                        </CardContent>
                      </Card>
                    );
                  })()}
              </div>
            </Modal>
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

/*
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
*/
