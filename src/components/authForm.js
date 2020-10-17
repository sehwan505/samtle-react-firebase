import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const AuthForm = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
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
          setError(error);
          console.log(error);
        }
      };
    
      const toggleAccount = () => setNewAccount((prev) => !prev);
    return(
        <>
      <form onSubmit={onSubmit} className="container">
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
        <input type="submit" value={newAccount ? "새로 계정 생성" : "로그인"}/>
        {error && <span>{error}</span>}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "로그인" : "계정생성"}	
      </span>
       </>
    )
}
export default AuthForm