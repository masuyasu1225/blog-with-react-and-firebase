import React, { useEffect, useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import "./CreatePost.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ isAuth }) => {
  const [title, setTitle] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const navigate = useNavigate();

  const createPost = async () => {
    await addDoc(collection(db, "posts"), {
      title: title,
      postsText: editorState.getCurrentContent().getPlainText("\u0001"),
      author: {
        username: auth.currentUser.displayName,
        id: auth.currentUser.uid,
      },
      createdAt: serverTimestamp(),
    });

    navigate("/");
  };

  // スタイルを適用する関数
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  const onUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
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
          <button onClick={onBoldClick}>Bold</button>
          <button onClick={onItalicClick}>Italic</button>
          <button onClick={onUnderlineClick}>Underline</button>
          <div className="editor">
            <Editor
              editorState={editorState}
              handleKeyCommand={handleKeyCommand}
              onChange={setEditorState}
              placeholder="投稿内容を記入"
            />
          </div>
        </div>
        <button className="postButton" onClick={createPost}>
          投稿する
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
