import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Nweet from "components/nweet";
import {v4 as uuidv4} from "uuid";

const Home = (userObj) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState(); 
  //   const getNweets = async () => {
  //     const dbnweets = await dbService.collection("nweets").get();
  //     dbnweets.forEach((document) => {
  //       const nweetObject = {
  //         ...document.data(),
  //         id: document.id,
  //       };
  //       setNweets((prev) => [nweetObject, ...prev]);
  //     });
  //   }; 구식
  useEffect(() => {
    dbService.collection("nweets").onSnapshot((snapshot) => {
      const nweetsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetsArray);
    });
  }, []);
  const onSubmit = async (event) => {
    // console.log(userObj);
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== ""){
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
       text: nweet,
       createdAt: Date.now(),
       creatorId: userObj.userObj.uid,
       attachmentUrl
    }
    await dbService.collection("nweets").add(nweetObj);
     setNweet("");
     setAttachment("");
  };
  const onFileChange = (event)=>{
    const {target:{files}} = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) =>{
      const {currentTarget: {result}} = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
    
  }
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onClearPhotoClick = () => setAttachment(null);
  return (
    <div>
      <form>
        <input
          type="text"
          onChange={onChange}
          value={nweet}
          placeholder="너의 생각은 어때"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange}/>
        <input type="submit" onClick={onSubmit} value="입력" />
        {attachment && 
          <div>
            <img src={attachment} with="50px" height="50px" />
            <button onClick={onClearPhotoClick}>취소</button>
          </div>}
      </form>
      <dir>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.userObj.uid}
          />
        ))}
      </dir>
    </div>
  );
};
export default Home;
