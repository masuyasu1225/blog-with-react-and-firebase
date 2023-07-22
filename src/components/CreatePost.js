import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Editor, EditorState } from "draft-js"; // Draft.jsのインポート

const CreatePost = ({ isAuth }) => {
  const [title, setTitle] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Draft.jsのエディタステートを作成
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const createPost = async () => {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);

          await addDoc(collection(db, "posts"), {
            title: title,
            postsText: editorState.getCurrentContent().getPlainText("\u0001"), // テキストエリアの代わりにDraft.jsのエディタステートを取得
            author: {
              username: auth.currentUser.displayName,
              id: auth.currentUser.uid,
            },
            imageURL: downloadURL,
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
          <Editor editorState={editorState} onChange={setEditorState} />{" "}
          {/* テキストエリアの代わりにDraft.jsのエディタを配置 */}
        </div>
        <input type="file" onChange={handleFileChange} />
        <button className="postButton" onClick={createPost}>
          投稿する
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
