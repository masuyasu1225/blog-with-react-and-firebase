import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import "./Home.css";

const Home = () => {
  const [postList, setPostList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(collection(db, "posts"));
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    window.location.href = "/";
  };

  const handleDetail = (id) => {
    navigate(`/createpost/${id}`);
  };

  return (
    <div className="homePage">
      {postList.map((post) => {
        return (
          <div className="postContents" key={post.id}>
            <div className="postHeader">
              <h1>{post.title}</h1>
            </div>
            <div className="postTextContainer">{post.postsText}</div>
            <div className="nameAndDeleteButton">
              <h3>@{post.author.username}</h3>
              <button
                className="postDetailButton"
                onClick={() => handleDetail(post.id)}
              >
                詳細
              </button>
              {post.author.id === auth.currentUser?.uid && (
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(post.id)}
                >
                  削除
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
