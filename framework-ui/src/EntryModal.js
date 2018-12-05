import React from "react";
import Modal from "@material-ui/core/Modal";
import { EntryCard } from "./EntryCard";

export const EntryModal = ({
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
        margin: 20,
        outline: "none"
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
