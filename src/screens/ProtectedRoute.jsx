import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase/config';
const ProtectedRoute = ({ component }) => {
    const navigate = useNavigate();
    const [userState, setUserState] = useState(false);
    useEffect(() => {
        try {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserState(true)
                } else {
                    setUserState(false)
                    navigate('/login')
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [])
    return (
        <>
            {userState ? component : null}
        </>
    )
}

export default ProtectedRoute
