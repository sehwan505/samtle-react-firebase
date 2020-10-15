import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
        //create account
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
        //login
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "facebook") {
      provider = new firebaseInstance.auth.FacebookAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
        />
        <input
          type="text"
          placeholder="Passwrd"
          name="password"
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "새로 계정 생성" : "로그인"} />
      </form>
      <span onClick={toggleAccount}>{newAccount ? "로긴" : "계정생성"}</span>
      <div>
        <button onClick={onSocialClick} name="google">
          구글로 계속하기
        </button>
        <button onClick={onSocialClick} name="facebook">
          페이스북으로 계속하기
        </button>
      </div>
    </div>
  );
};

export default Auth;
