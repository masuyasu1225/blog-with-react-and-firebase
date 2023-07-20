import React, { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Reply.css";

const Reply = ({ postId, onNewReply }) => {
  const [replyText, setReplyText] = useState();

  const createReply = async () => {
    if (auth.currentUser) {
      const docRef = await addDoc(collection(db, "replies"), {
        postId: postId,
        replyText: replyText,
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: serverTimestamp(),
      });

      //リプライ一覧を更新
      const docSnap = await getDoc(docRef);
      const newReply = { ...docSnap.data(), id: docRef.id };
      onNewReply(newReply);
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
