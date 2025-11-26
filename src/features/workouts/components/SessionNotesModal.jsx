import { useState } from "react";
import {
  FaNoteSticky,
  FaPencil,
  FaXmark,
  FaFloppyDisk,
  FaFileCircleQuestion,
} from "react-icons/fa6";
import "./SessionNotesModal.css";

const SessionNotesModal = ({ notes, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [noteText, setNoteText] = useState(notes || "");
  const [isEditing, setIsEditing] = useState(false);

  const MAX_CHARS = 1000;
  const charCount = noteText.length;
  const isNearLimit = charCount > MAX_CHARS * 0.8;
  const isOverLimit = charCount > MAX_CHARS;

  const openModal = () => {
    setIsOpen(true);
    setIsEditing(false);
    setNoteText(notes || "");
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (charCount <= MAX_CHARS) {
      onSave(noteText.trim());
      setIsEditing(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setNoteText(notes || "");
    setIsEditing(false);
  };

  const hasNotes = notes && notes.trim().length > 0;

  return (
    <>
      <button
        onClick={openModal}
        className={`notes-icon-btn ${hasNotes ? "has-notes" : ""}`}
        aria-label="View session notes"
        title={hasNotes ? "View notes" : "Add notes"}
      >
        <FaNoteSticky />
      </button>
      {isOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <h2 id="modal-title">
                <FaNoteSticky />
                Session Notes
              </h2>
              <button
                onClick={closeModal}
                className="close-btn"
                aria-label="Close modal"
              >
                <FaXmark />
              </button>
            </div>

            <div className="modal-body">
              {!isEditing ? (
                <div className={`notes-content ${!noteText ? "empty" : ""}`}>
                  {noteText || (
                    <>
                      <FaFileCircleQuestion />
                      <span>No notes available.</span>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <textarea
                    className="notes-textarea"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add your session notes here..."
                    maxLength={MAX_CHARS}
                    autoFocus
                  />
                  <div
                    className={`character-counter ${
                      isNearLimit ? "warning" : ""
                    } ${isOverLimit ? "error" : ""}`}
                  >
                    {charCount} / {MAX_CHARS} characters
                  </div>
                </>
              )}
            </div>

            <div className={`modal-footer ${isEditing ? "" : "space-between"}`}>
              {!isEditing ? (
                <>
                  <button
                    className="notes-modal-btn btn-cancel"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="notes-modal-btn btn-edit"
                    onClick={handleEdit}
                    aria-label="Edit notes"
                  >
                    <FaPencil />
                    {noteText ? "Edit" : "Add Notes"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="notes-modal-btn btn-cancel"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="notes-modal-btn btn-save"
                    onClick={handleSave}
                    disabled={isOverLimit}
                  >
                    <FaFloppyDisk />
                    Save Notes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionNotesModal;
