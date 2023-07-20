import React from "react";
import Modal from "react-modal";
import "./ConfirmModal.css";

const ConfirmModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmation Modal"
      className="confirmationModal"
      overlayClassName="modalOverlay"
    >
      <h2>この記事を削除しますか？</h2>
      <div className="confirmationButton">
        <button onClick={onConfirm} className="yesButton">
          削除
        </button>
        <button onClick={onRequestClose} className="noButton">
          キャンセル
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
