import React, { useEffect, useState } from 'react'
import { auth,db } from '../config/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { signOutUser } from '../config/firebase/firebasemethods';
const Navbar = () => {
    const [userState, setUserState] = useState(false);
    const [currentUser,setCurrentUser] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = location.pathname;
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(
                    collection(db, "users"),
                    where("uid", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const userData = querySnapshot.docs.map((doc) => doc.data());
                setCurrentUser(userData[0])
                setUserState(true)
            } else {
                setUserState(false)
            }
        });
    }, [])
    const logOutUser = async () => {
        await signOutUser()
        navigate('/login')
    }
    return (
        <>
            {userState ? <div className={
                currentPage === '/login' || currentPage === '/register' 
                ? "navbar px-5 bg-[#7749f8] text-white" 
                : "navbar px-5 bg-[#7749f8] relative text-white"}>
                <div className="flex-1">
                    <Link to={'/'} className="btn btn-ghost text-xl">Blogging App</Link>
                </div>
                <div className="flex-none gap-2">
                    <a className="btn btn-ghost nav-username text-xl">{currentUser.name}</a>
                    <div className="dropdown items-center dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    id="pfp"
                                    alt="Tailwind CSS Navbar component"
                                    src={currentUser.pfp}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            {currentPage === '/dashboard' ? <>
                            <li className="profileBtn">
                                <Link to={'/'} className="justify-between">
                                    Home
                                </Link>
                            </li>
                            <li className="profileBtn">
                                <Link to={'/profile'} className="justify-between">
                                    Profile
                                </Link>
                            </li>
                            <li className="nav-logout-btn">
                                <a onClick={logOutUser}>Logout</a>
                            </li></> : currentPage === '/profile' ? <><li className="dashboardBtn">
                                <Link to={'/'}>Home</Link>
                            </li>
                            <li className="dashboardBtn">
                                <Link to={'/dashboard'}>Dashboard</Link>
                            </li>
                            <li className="nav-logout-btn">
                                <a onClick={logOutUser}>Logout</a>
                            </li></> : <>
                            <li className="profileBtn">
                                <Link to={'/profile'} className="justify-between">
                                    Profile
                                </Link>
                            </li>
                            <li className="dashboardBtn">
                                <Link to={'/dashboard'}>Dashboard</Link>
                            </li>
                            <li className="nav-logout-btn">
                                <a onClick={logOutUser}>Logout</a>
                            </li>
                            </>}
                        </ul>
                    </div>
                </div>
            </div> : <div className="navbar px-5 bg-[#7749f8] text-white">
                <div className="flex-1">
                {currentPage === '/login' ? <a className="btn btn-ghost text-xl">Login</a> : currentPage === '/register' ? <a className="btn btn-ghost text-xl">Register</a> : <Link to={'/'} className="btn btn-ghost text-xl">Blogging App</Link>}
                </div>
                <div className="flex-none gap-2">
                    <a className="btn btn-ghost nav-username text-xl" />
                    <div className="dropdown items-center dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    id="pfp"
                                    alt="Tailwind CSS Navbar component"
                                    src="https://png.pngtree.com/png-vector/20220608/ourmid/pngtree-man-avatar-isolated-on-white-background-png-image_4891418.png"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li className="nav-login-btn">
                                <Link to={'/login'}>Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Navbar