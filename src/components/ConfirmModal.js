import React from "react";
import Modal from "react-modal";

const ConfirmModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmation Modal"
    >
      <h2>この記事を削除していいですか？</h2>
      <button onClick={onConfirm}>はい</button>
      <button onClick={onRequestClose}>いいえ</button>
    </Modal>
  );
};

export default ConfirmModal;
