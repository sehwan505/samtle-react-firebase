import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Nweet from "components/nweet";
import NweetFactory from "components/nweetFactory"

const Home = (userObj) => {
  const [nweets, setNweets] = useState([]);
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
  
  return (
    <div>
      <NweetFactory userObj={userObj}/>
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
