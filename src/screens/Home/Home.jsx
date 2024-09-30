import React, { useEffect, useState } from 'react'
import './style.css'
import Greeting from '../../components/Greeting'
import { auth, db, getAllData } from '../../config/firebase/firebasemethods';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { addUser } from '../../config/redux/reducers/userSlice';
import { onAuthStateChanged } from 'firebase/auth';
const Home = () => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.user.user)
  selector ? getDataFromFirestoreFirebase() : null
  const [allBlogs, setAllBlogs] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getAllData("blogs")
      .then(arr => {
        setAllBlogs(arr)
        console.log(arr);
      })
      .catch(err => {
        alert(err)
      })
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          getDataFromFirestoreFirebase()
        } else {
          null
        }
      });
  }, [])
  async function getDataFromFirestoreFirebase() {
    const q = query(
      collection(db, "users"),
      where("uid", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const userData = querySnapshot.docs.map((doc) => doc.data());
    dispatch(addUser(
      {
        user: userData[0]
      }
    ))
  }
  const goToSinglePage = (index)=>{
    localStorage.setItem('singleUser', JSON.stringify(allBlogs[index]));
    navigate('/singleuser')
  }
  return (
    <div style={{
      minHeight: '100vh'
    }} >
      <Greeting />
      <div className="my-container">
        <h1 className="text-black font-semibold my-5 text-xl">All blogs</h1>
        <div className="flex gap-x-[2rem] justify-between">
          <div className="flex max-w-[64rem] w-[64rem] gap-[1.25rem] flex-col">
            <div
              id="all-blogs-wrapper"
              className="p-[1.3rem] flex flex-col rounded-xl bg-white"
            >
              <div className="text-center">
                {allBlogs.length > 0 ? allBlogs.map((item, index) => {
                  return <div key={item.documentId}>
                    <div className="p-[1rem] text-left flex flex-col rounded-xl bg-white">
                      <div className="flex justify-start gap-4">
                        <div>
                          <img className="rounded-xl" width="70px" src={item.pfp} alt="" />
                        </div>
                        <div className="flex flex-col justify-end">
                          <div>
                            <h1 className="text-black font-semibold text-lg">
                              {item.title}
                            </h1>
                          </div>
                          <div className="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1>
                              {item.name}
                              <span>
                                {" "}
                                - {item.time}
                              </span>
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[#6C757D]">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-3">
                        <p onClick={()=> goToSinglePage(index)} id="seeAll" className="text-[#7749f8] cursor-pointer font-semibold">
                          <p>see all from this user</p>
                        </p>
                      </div>
                    </div>
                  </div>
                }) : <span className="loading loading-spinner loading-lg" />}
              </div>
            </div>
          </div>
          <div id="sidebar">
            <div className="flex mb-5 justify-center">
              <div className="group">
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
                <input placeholder="Search" type="search" className="input-search" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
