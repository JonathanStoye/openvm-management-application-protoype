import React, { Component } from "react";
import api from "./api";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Downshift from "downshift";

import { setEntryInUrl, sortAlphabetically, searchRanked } from "./utils";
import { EntryCard } from "./EntryCard";
import { EntryModal } from "./EntryModal";

class App extends Component {
  state = {
    entries: [],
    referenceTypes: [],
    urlEntry: null
  };

  async componentDidMount() {
    const getEntiresResponse = await api.getEntires();
    const getEntiresData = await getEntiresResponse.json();
    const entries = sortAlphabetically(
      getEntiresData["@graph"],
      // Tell the sort function to sort by which attribute
      entry => entry.prefLabel.value
    );
    this.setState({ entries });

    const getReferenceTypesResponse = await api.getReferenceTypes();
    const getReferenceTypesData = await getReferenceTypesResponse.json();
    const referenceTypes = sortAlphabetically(
      getReferenceTypesData["@graph"],
      // Tell the sort function to sort by which attribute
      referenceType => referenceType.label
    );
    this.setState({ referenceTypes });

    // If there is an entry id present in the url on load open the modal with it
    const url = new URL(window.location);
    const urlEntry = url.searchParams.get("entry");
    if (urlEntry) {
      this.setState({ urlEntry });
      this.setPreSelectedEntry(urlEntry);
    }

    this.setEntryFromUrl();

    // Listen to history changes
    window.onpopstate = this.setEntryFromUrl;
  }

  // If an entry id is present in the url select this entry
  setEntryFromUrl = () => {
    const url = new URL(window.location);
    const urlEntry = url.searchParams.get("entry");
    if (urlEntry) {
      this.setState({ urlEntry });
      this.setPreSelectedEntry(urlEntry);
    }
  };

  // To a given entry id get the entry from the entris and select it
  setPreSelectedEntry = urlEntry => {
    const { entries } = this.state;
    const preSelectedEntry = entries.filter(({ id }) => urlEntry === id)[0];
    this.selectItem(preSelectedEntry);
    // Make sure the input field is still empty
    this.setEntriesState({ inputValue: "", isOpen: true });
  };

  // We have to modify Downshifts state handling behaviour
  stateReducer = (state, changes) => {
    // On modal close remove the entry from the url
    // These condirions are a hack to make sure it is only fired when closing the modal
    if (
      Object.keys(changes).length === 1 &&
      Object.keys(changes)[0] === "isOpen" &&
      changes.isOpen === false
    ) {
      const url = new URL(window.location);
      url.search = "";
      window.history.pushState({}, "", url.toString());
    }
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        // On modal open add the entry to the url
        const id = changes.selectedItem.id;
        setEntryInUrl(id);
        return {
          ...changes,
          inputValue: state.inputValue,
          isOpen: true
        };
      case Downshift.stateChangeTypes.changeInput:
        return {
          ...changes,
          isOpen: false
        };
      case Downshift.stateChangeTypes.mouseUp:
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.unknown:
        return state;
      default:
        return changes;
    }
  };

  render() {
    const { entries, referenceTypes, urlEntry } = this.state;
    return (
      <Downshift
        itemToString={item => (item ? item.prefLabel.value : "")}
        stateReducer={this.stateReducer}
        defaultIsOpen={!!urlEntry}
      >
        {downShift => {
          this.selectItem = downShift.selectItem;
          this.setEntriesState = downShift.setState;

          let renderEntries = entries;
          if (downShift.inputValue) {
            renderEntries = searchRanked(downShift.inputValue, renderEntries);
          }

          const gridItems = renderEntries.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              {...downShift.getItemProps({
                item,
                key: item.prefLabel.value + index
              })}
            >
              <EntryCard
                item={item}
                hasDetails
                setPreSelectedEntry={this.setPreSelectedEntry}
                {...downShift.getItemProps({
                  index,
                  item,
                  raised:
                    downShift.highlightedIndex === index ||
                    downShift.selectedItem === item,
                  style: {
                    height: "100%",
                    cursor: "pointer",
                    position: "relative"
                  }
                })}
              />
            </Grid>
          ));

          return (
            <div style={{ padding: "42px 36px" }}>
              <Typography component="h2" variant="h2" gutterBottom>
                OpenVM Directory
              </Typography>
              <label {...downShift.getLabelProps()}>
                Search entries:&nbsp;&nbsp;
              </label>
              <Input
                {...downShift.getInputProps({
                  placeholder: "by label and description"
                })}
              />
              <br />
              <br />
              <br />
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="stretch"
                spacing={24}
                {...downShift.getMenuProps()}
              >
                {gridItems}
              </Grid>
              <EntryModal
                setPreSelectedEntry={this.setPreSelectedEntry}
                isOpen={downShift.isOpen}
                selectedItem={downShift.selectedItem}
                referenceTypes={referenceTypes}
                closeMenu={downShift.closeMenu}
              />
            </div>
          );
        }}
      </Downshift>
    );
  }
}

export default App;
