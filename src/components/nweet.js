import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("진짜 지울거임?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentUrl).delete()
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text:newNweet
    });
    toggleEditing();
  }
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  }
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              value={newNweet}
              placeholder="고쳐라"
              type="text"
              onChange={onChange}
            />
            <input type="submit" value="에딧"/>
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src = {nweetObj.attachmentUrl} width="100px" height='100px'/>
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
