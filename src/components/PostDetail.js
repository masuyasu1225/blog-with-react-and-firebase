import React, { useEffect, useState } from "react";
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

  return (
    <div className="postDetailPage">
      {post && (
        <>
          <h1>{post.title}</h1>
          <p>{post.postsText}</p>
          <Reply postId={id} />
          {replies.map((reply, index) => (
            <div key={index}>
              <h3>{reply.author.username}</h3>
              <p>{reply.replyText}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PostDetail;
