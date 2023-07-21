import React, { useEffect, useState } from "react";
import "./PostDetail.css";
import {
  collection,
  doc,
  getDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Reply from "./Reply";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const [post, setPost] = useState();
  const [replies, setReplies] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getPostAndReplies = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        console.log("No such document!");
      }

      const q = query(collection(db, "replies"), where("postId", "==", id));
      const querySnapshot = await getDocs(q);
      setReplies(querySnapshot.docs.map((doc) => doc.data()));
    };

    getPostAndReplies();
  }, [id]);

  //リプライを更新
  const handleNewReply = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
  };

  return (
    <div className="postDetailPage">
      {post && (
        <>
          <div className="createPost">
            <h1>{post.title}</h1>
            <p>{post.postsText}</p>
            <p>{post.createdAt.toDate().toLocaleString()}</p>
            {post.imageURL && <img src={post.imageURL} alt="Post" />}{" "}
            {/* ここで画像を表示 */}
          </div>
          {replies.map((reply, index) => (
            <div key={index} className="replyContainer">
              <h3>{reply.author.username}</h3>
              <p>{reply.replyText}</p>
              <p>{reply.createdAt.toDate().toLocaleString()}</p>
            </div>
          ))}
          <Reply postId={id} onNewReply={handleNewReply} />
        </>
      )}
    </div>
  );
};

export default PostDetail;
