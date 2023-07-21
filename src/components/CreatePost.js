import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ isAuth }) => {
  const [title, setTitle] = useState();
  const [postText, setPostText] = useState();
  const [file, setFile] = useState(null); // 追加: ファイルのstate

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // 追加: ファイルの変更をハンドリング
  };

  const createPost = async () => {
    // 新規: 画像をFirebase Storageにアップロード
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);

          await addDoc(collection(db, "posts"), {
            title: title,
            postsText: postText,
            author: {
              username: auth.currentUser.displayName,
              id: auth.currentUser.uid,
            },
            imageURL: downloadURL, // downloadURLを保存
            createdAt: serverTimestamp(),
          });

          navigate("/");
        });
      }
    );
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  });

  return (
    <div className="createPostPage">
      <div className="postContainer">
        <h1 className="postHeader">記事を投稿する</h1>
        <div className="inputPost">
          <div className="title">タイトル</div>
          <input
            className="titleForm"
            type="text"
            placeholder="タイトルを記入"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="inputPost">
          <div>投稿</div>
          <textarea
            placeholder="投稿内容を記入"
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
        </div>
        <input type="file" onChange={handleFileChange} />{" "}
        {/* ファイル選択のinput */}
        <button className="postButton" onClick={createPost}>
          投稿する
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
