import React, { useEffect, useState } from 'react'
import Greeting from '../../components/Greeting'
import './Profile.css'
import { auth, db, getData, updateDocument, uploadImage } from '../../config/firebase/firebasemethods';
import { sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../config/redux/reducers/userSlice';

const Profile = () => {
    const userSelector = useSelector(state => state.user.user[0])
    const dispatch = useDispatch();
    useEffect(() => {
        console.log("Updated selector:", userSelector);
    }, []);
    const showSnackbar = (num) => {
        var snackbar = document.getElementById(`snackbar${num}`);
        snackbar.className = "show";
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    }
    const passwordReset = () => {
        sendPasswordResetEmail(auth, userSelector.email)
            .then(() => {
                showSnackbar(3);
            })
            .catch((error) => {
                alert(errorMessage)
            });
    }
    const clickIcon = () => {
        const fileInput = document.querySelector('#fileInput');
        fileInput.click();
    }
    const editPfp = async (event) => {
        const file = event.target.files[0];
        const url = await uploadImage(file, userSelector.email)
        const dpRef = doc(db, "users", userSelector.uid);
        await updateDoc(dpRef, {
            pfp: url
        })
            .then(msg => {
                console.log(msg);
                dispatch(addUser(
                    {
                        user: {
                            ...userSelector,
                            pfp: url
                        }
                    }
                ))
                showSnackbar(1)
            })
            .catch(err => {
                console.log(err);
            })
        event.target.value = ''
    }
    const editName = async () => {
        const editedVal = prompt("Enter new name!");
        if (!editedVal || editedVal.trim() === "") {
            alert('Please enter a valid name!');
            return;
        }
        try {
            const nameRef = doc(db, "users", userSelector.uid);
            await updateDoc(nameRef, {
                name: editedVal
            })
            .then(msg => {
                console.log(msg);
                console.log("Name successfully updated in Firestore!");
                dispatch(addUser(
                    {
                        user: {
                            ...userSelector,
                            name: editedVal
                        }
                    }
                ))
                showSnackbar(2);
            })
            .catch(err => {
                console.log(err);
            })
        } catch (err) {
            console.error("Error updating document:", err);
        }
    };


    return (
        <div style={{
            minHeight: '100vh'
        }}>
            <div id="snackbar1">Profile Picture Updated!</div>
            <div id="snackbar2">Name Updated!</div>
            <div className='text-center' id="snackbar3">Password reset email has been sent to your registered email address <br /> {userSelector ? userSelector.email : null}!</div>
            <Greeting />
            <div className="my-container">
                <div className="p-[2rem] profile-wrapper w-full bg-white mt-5 gap-4rounded-xl gap-[1.25rem]">
                    <div className="text-center mt-[3rem]">
                        {userSelector ? <>
                            <div className="max-w-[225px] mx-auto relative">
                                <img className="w-full rounded-full mx-auto" id="pfp" src={userSelector.pfp} alt="" />
                                <div
                                    onClick={clickIcon}
                                    className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer"
                                    id="editPfpBtn"
                                >
                                    <img src="https://i.ibb.co/3fnjZcF/edit.png" alt="Edit" className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex justify-center mt-5 items-center">
                                <h1 className="text-center font-semibold text-3xl text-black">
                                    {userSelector.name}
                                </h1>
                                <img
                                    onClick={editName}
                                    id="editNameBtn"
                                    src="https://i.ibb.co/3fnjZcF/edit.png"
                                    alt="Edit"
                                    className="w-4 ms-1 cursor-pointer mt-1 h-4"
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={passwordReset}
                                    id="reset-Btn"
                                    className="btn mt-5 text-white font-bold bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                                >
                                    Reset Password?
                                </button>
                            </div>
                            <input onChange={editPfp} type="file" id="fileInput" accept="image/*" className="hidden" />
                        </> : <span className="loading loading-spinner loading-lg" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
