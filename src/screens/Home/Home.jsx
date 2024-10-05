import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import Greeting from '../../components/Greeting'
import { auth, getAllData, getData } from '../../config/firebase/firebasemethods';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { addUser } from '../../config/redux/reducers/userSlice';
import { addAllBlogs } from '../../config/redux/reducers/allBlogsSlice';
const Home = () => {
  const inputSearch = useRef();
  const [allBlogs, setAllBlogs] = useState([]);
  const [searchedBlogs,setSearchedBlogs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogSelector = useSelector(state => state.allBlogs.blogs)
  useEffect(() => {
    blogSelector.length > 0 ? setAllBlogs(blogSelector) : getAllData("blogs")
      .then(arr => {
        setAllBlogs(arr)
        dispatch(addAllBlogs({
          arr,
        }))
      })
      .catch(err => {
        console.log(err)
      });
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user);
        getUserData()
      } else {
        null
      }
    })
  }, [])
  function getUserData() {
    getData("users", auth.currentUser.uid)
      .then(arr => {
        dispatch(addUser(
          {
            user: arr
          }
        ))
      })
      .catch(err => {
        console.log(err);
      })
  }
  const goToSinglePage = (index) => {
    localStorage.setItem('singleUser', JSON.stringify(allBlogs[index]));
    navigate('/singleuser')
  }
  const searchBlogs = () => {
    const searchValue = inputSearch.current.value.toLowerCase();
    const filteredArr = allBlogs.filter(item => {
        return item.title.toLowerCase().includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue);
    });
    setSearchedBlogs(filteredArr)
  }
  return (
    <div style={{
      minHeight: '100vh'
    }} >
      <Greeting />
      <div className="my-container">
        <h1 className="text-black font-semibold my-5 text-xl">All blogs</h1>
        <div className="flex gap-x-[2rem] main-wrapper justify-between">
          <div id='left' className="flex max-w-[64rem] w-[64rem] gap-[1.25rem] flex-col">
            <div
              id="all-blogs-wrapper"
              className="p-[1.3rem] mb-[20px] flex flex-col rounded-xl bg-white"
            >
              <div className="text-center">
                {allBlogs.length > 0 && searchedBlogs.length > 0 ? searchedBlogs.map((item, index) => {
                  return <div key={item.documentId}>
                    <div className="p-[1rem] text-left flex flex-col rounded-xl bg-white">
                      <div className="flex justify-start blogWrapper gap-4">
                        <div>
                          <img className="rounded-xl blogImg" width="70px" src={item.pfp} alt="" />
                        </div>
                        <div className="flex flex-col justify-end">
                          <div>
                            <h1 className="text-black font-semibold text-lg">
                              {item.title}
                            </h1>
                          </div>
                          <div className="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1 class="blogTime">
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
                        <p onClick={() => goToSinglePage(index)} id="seeAll" className="text-[#7749f8] cursor-pointer font-semibold">
                          <span>see all from this user</span>
                        </p>
                      </div>
                    </div>
                  </div>
                }) : allBlogs.length > 0 ? allBlogs.map((item, index) => {
                  return <div key={item.documentId}>
                    <div className="p-[1rem] text-left flex flex-col rounded-xl bg-white">
                      <div className="flex justify-start blogWrapper gap-4">
                        <div>
                          <img className="rounded-xl blogImg" width="70px" src={item.pfp} alt="" />
                        </div>
                        <div className="flex flex-col justify-end">
                          <div>
                            <h1 className="text-black font-semibold text-lg">
                              {item.title}
                            </h1>
                          </div>
                          <div className="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1 class="blogTime">
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
                        <p onClick={() => goToSinglePage(index)} id="seeAll" className="text-[#7749f8] cursor-pointer font-semibold">
                          <span>see all from this user</span>
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
                <input onInput={searchBlogs} placeholder="Search" type="search" className="input-search" ref={inputSearch}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
