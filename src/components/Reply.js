import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const Reply = ({ postId }) => {
  const [replyText, setReplyText] = useState();

  const createReply = async () => {
    if (auth.currentUser) {
      await addDoc(collection(db, "replies"), {
        postId: postId,
        replyText: replyText,
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: serverTimestamp(),
      });
    }
  };

  return (
    <div className="createReplySection">
      <div className="inputReply">
        <div>リプライ</div>
        <textarea
          placeholder="リプライ内容を記入"
          onChange={(e) => setReplyText(e.target.value)}
        ></textarea>
      </div>
      <button className="replyButton" onClick={createReply}>
        リプライする
      </button>
    </div>
  );
};

export default Reply;
