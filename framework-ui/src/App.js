import React, { Fragment, Component } from "react";
import api from "./api";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Downshift from "downshift";

class App extends Component {
  state = {
    entries: [],
    referenceTypes: [],
    urlEntry: null
  };

  async componentDidMount() {
    const getEntiresResponse = await api.getEntires();
    const getEntiresData = await getEntiresResponse.json();
    this.setState({
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
    });
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

  setEntryFromUrl = () => {
    const url = new URL(window.location);
    const urlEntry = url.searchParams.get("entry");
    if (urlEntry) {
      this.setState({ urlEntry });
      this.setPreSelectedEntry(urlEntry);
    }
  };

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

  setPreSelectedEntry = urlEntry => {
    const { entries } = this.state;
    const preSelectedEntry = entries.filter(({ id }) => urlEntry === id)[0];
    this.selectItem(preSelectedEntry);
    // Make sure the input field is still empty
    this.setEntriesState({ inputValue: "", isOpen: true });
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
            const rankedEntries = renderEntries
              .map(item => {
                let found = 0;
                if (item.prefLabel.value.includes(downShift.inputValue)) {
                  found = found + 5;
                }
                if (item.description.value.includes(downShift.inputValue)) {
                  found = found + 5;
                }
                found =
                  found +
                  downShift.inputValue.split(" ").reduce((prev, curr) => {
                    return item.prefLabel.value.includes(curr)
                      ? prev + 1
                      : item.description.value.includes(curr)
                      ? prev + 1
                      : prev;
                  }, 0);
                return { ranking: found, value: item };
              })
              .sort((a, b) => b.ranking - a.ranking);

            const highestRanking = rankedEntries.reduce(
              (highestRanking, { ranking }) =>
                ranking > highestRanking ? ranking : highestRanking,
              0
            );
            renderEntries = rankedEntries
              .slice(
                0,
                Math.floor(
                  renderEntries.length /
                    (highestRanking * (downShift.inputValue.length / 6))
                )
              )
              .map(({ value }) => value);
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

const EntryCard = ({
  item,
  referenceTypes,
  hasDetails,
  setPreSelectedEntry,
  ...props
}) => {
  const {
    id,
    skillType,
    skillReuseLevel,
    prefLabel,
    altLabel,
    description,
    ...rest
  } = item;
  let references = [];
  // Only render references if types are provided
  if (referenceTypes) {
    for (let referenceKey in rest) {
      const referenceTitle = referenceTypes.reduce(
        (prev, { key, label }) => (key === referenceKey ? label : prev),
        ""
      );
      const referenceTitleUpperFirst =
        referenceTitle.charAt(0).toUpperCase() + referenceTitle.substr(1);
      const referenceItems =
        typeof rest[referenceKey] === "string"
          ? [rest[referenceKey]]
          : rest[referenceKey];
      if (referenceItems.length > 0) {
        references.push(
          <Fragment key={referenceTitleUpperFirst}>
            <Typography variant="subtitle1">
              {referenceTitleUpperFirst}:
            </Typography>
            <List dense>
              {referenceItems.map(id => (
                <ListItem key={id}>
                  <a
                    href={`?entry=${id.toLowerCase()}`}
                    onClick={e => {
                      // If the link directs to the app again prevent opening it
                      // Instead push to the history and open the modal withou leaving the page
                      if (id.toLowerCase().includes("localhost")) {
                        e.preventDefault();
                        setEntryInUrl(id.toLowerCase());
                        setPreSelectedEntry(id);
                      }
                    }}
                  >
                    {id.toLowerCase()}
                  </a>
                </ListItem>
              ))}
            </List>
          </Fragment>
        );
      }
    }
  }
  return (
    <Card
      onClick={e => e.stopPropagation()}
      style={{ padding: "18px 12px", maxWidth: 420 }}
      {...props}
    >
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
          height: "100%",
          boxSizing: "border-box"
        }}
      >
        <Typography color="textSecondary" gutterBottom>
          Type: {skillType}
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          style={{ lineHeight: 1.2 }}
          gutterBottom
        >
          {prefLabel.value}
        </Typography>
        {!hasDetails && (
          <Fragment>
            <Chip
              label={"Language: " + prefLabel.language}
              style={{ margin: "3px 7px 3px -1px", height: 22 }}
            />
            <Chip
              label={"Reuse: " + skillReuseLevel.substr(2)}
              style={{ margin: "3px 7px 18px -1px", height: 22 }}
            />
          </Fragment>
        )}
        <Typography variant="subtitle1">Description:</Typography>
        <Typography paragraph>
          {hasDetails
            ? description.value.split(" ", 20).join(" ") + "..."
            : description.value}
        </Typography>
        {references}
        {hasDetails && (
          <div
            style={{
              flexGrow: 1,
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end"
            }}
          >
            <Button variant="outlined" style={{ alignSelf: "flex-end" }}>
              Show Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EntryModal = ({
  isOpen,
  selectedItem,
  referenceTypes,
  closeMenu,
  setPreSelectedEntry
}) => (
  <Modal open={!!(isOpen && selectedItem)} disablePortal={true}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        margin: 20
      }}
      onClick={closeMenu}
    >
      {selectedItem && (
        <EntryCard
          item={selectedItem}
          referenceTypes={referenceTypes}
          setPreSelectedEntry={setPreSelectedEntry}
        />
      )}
    </div>
  </Modal>
);

const setEntryInUrl = id => {
  const url = new URL(window.location);
  url.search = `?entry=${id}`;
  window.history.pushState({}, "", url.toString());
};
