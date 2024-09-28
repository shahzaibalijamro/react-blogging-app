import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase/config';
const SignOutRoutes = ({ component }) => {
    const navigate = useNavigate();
    const [userState, setUserState] = useState(false);
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserState(true)
                navigate('/')
            } else {
                setUserState(false)
            }
        });
    }, [])
    return (
        <>
            {userState ? null : component}
        </>
    )
}

export default SignOutRoutes
