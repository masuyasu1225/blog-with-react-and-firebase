import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import CreateReply from "./CreateReply";
const PostDetail = ({ match }) => {
  const [post, setPost] = useState();

  useEffect(() => {
    const getPost = async () => {
      const docRef = doc(db, "posts", match.params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    getPost();
  }, [match.params.id]);

  return (
    <div className="postDetailPage">
      {post && (
        <>
          <h1>{post.title}</h1>
          <p>{post.postsText}</p>
          <CreateReply postId={match.params.id} />
        </>
      )}
    </div>
  );
};

export default PostDetail;
