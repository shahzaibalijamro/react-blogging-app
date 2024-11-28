import React, { useEffect, useRef, useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom';
import { auth, getData, loginUser } from '../../config/firebase/firebasemethods';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { addUser, emptyUser } from '../../config/redux/reducers/userSlice';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();
  const signInUser = async event => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      .then((userCredential) => {
        // async function getUserData() {
        //   await getData("users", auth.currentUser.uid)
        //     .then(arr => {
        //       dispatch(addUser(
        //         {
        //           user: arr
        //         }
        //       ))
        //     })
        //     navigate('/')
        //     .catch(err => {
        //       console.log(err);
        //     })
        // }
        // getUserData();
        navigate('/')
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage)
      });
  }
  return (
    <div className="h-[100vh] flex justify-center p-5 items-center">
      <div className="max-w-xl w-[512px]">
        <h1 className="text-3xl text-center font-semibold text-black mb-5">
          Login
        </h1>
        <div className="bg-white my-box-shadow rounded-lg p-[2.25rem]">
          <form onSubmit={signInUser}>
            <h1 className="text-lg font-medium ms-1 mb-2 text-black">Email</h1>
            <input
              id="emailInput"
              type="text"
              placeholder="Enter your email"
              className="input bg-white input-bordered w-[100%]"
              required
              ref={emailRef}
            />
            <h1 className="text-lg font-medium ms-1 mt-5 mb-2 text-black">
              Password
            </h1>
            <input
              id="passwordInput"
              type="password"
              placeholder="Enter your password"
              className="input bg-white input-bordered w-[100%]"
              required
              ref={passwordRef}
            />
            <div className="text-center">
              <button
                type="submit"
                className="btn bg-[#7749f8] hover:bg-[#6128ff] mt-[1.5rem] text-white border-[#4c68ff]"
              >
                Login
              </button>
              <p className="mt-3 text-[#4c68ff]">
                <Link to={'/register'}>Not a user? Register here!</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login