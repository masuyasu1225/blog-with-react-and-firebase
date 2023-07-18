import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Reply from "./Reply";
import { useParams } from "react-router-dom";

const PostDetail = () => {
  const [post, setPost] = useState();
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    getPost();
  }, [id]);

  return (
    <div className="postDetailPage">
      {post && (
        <>
          <h1>{post.title}</h1>
          <p>{post.postsText}</p>
          <Reply postId={id} />
        </>
      )}
    </div>
  );
};

export default PostDetail;
