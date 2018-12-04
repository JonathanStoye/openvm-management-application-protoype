import React, { Fragment } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { setEntryInUrl } from "./utils";

export const EntryCard = ({
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
