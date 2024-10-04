import React, { useEffect, useRef, useState } from 'react'
import './dashboard.css'
import Greeting from '../../components/Greeting'
import { auth, getData, sendData } from '../../config/firebase/firebasemethods';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../config/redux/reducers/userSlice';
const Dashboard = () => {
  const inputSearch = useRef();
  const [searchedBlogs,setSearchedBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const userSelector = useSelector(state => state.user.user[0])
  const blogTitle = useRef();
  const blogDescription = useRef();
  const dispatch = useDispatch();
  const showSnackbar = () => {
    var snackbar = document.getElementById("snackbar");
    snackbar.className = "show";
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
  }
  useEffect(() => {
    !userSelector ? getData("users", auth.currentUser.uid)
      .then(arr => {
        console.log(arr);
        dispatch(addUser(
          {
            user: arr
          }
        ))
      })
      .catch(err => {
        console.log(err);
      })
      : null
    getData("blogs", auth.currentUser.uid)
      .then(arr => {
        setMyBlogs(arr)
      })
      .catch(err => {
        console.log(err);
      })
  });
  const pushDataToFirestore = (event) => {
    event.preventDefault();
    const current = new Date();
    const currentDate = current.getDate();
    const currentMonth = current.getMonth();
    const currentYear = current.getFullYear();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const correctedDate = (currentDate === 1 ? currentDate + 'st' :
      currentDate === 2 ? currentDate + 'nd' :
        currentDate === 3 ? currentDate + 'rd' :
          currentDate === 21 ? currentDate + 'st' :
            currentDate === 22 ? currentDate + 'nd' :
              currentDate === 23 ? currentDate + 'rd' :
                currentDate + 'th');

    const formattedTime = `${months[currentMonth]} ${correctedDate}, ${currentYear}`;
    sendData(
      {
        title: blogTitle.current.value,
        description: blogDescription.current.value,
        time: formattedTime,
        uid: userSelector.uid,
        pfp: userSelector.pfp,
        name: userSelector.name,
        email: userSelector.email
      }, "blogs"
    )
      .then((res) => {
        console.log(res);
      })
    getData("blogs", auth.currentUser.uid)
      .then(arr => {
        setMyBlogs(arr)
      })
      .catch(err => {
        alert(err)
      })
    showSnackbar()
    blogTitle.current.value = '';
    blogDescription.current.value = '';
  }
  const searchBlogs = () => {
    const searchValue = inputSearch.current.value.toLowerCase();
    const filteredArr = myBlogs.filter(item => {
        return item.title.toLowerCase().includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue);
    });
    setSearchedBlogs(filteredArr)
  }

  return (
    <div style={{
      minHeight: '100vh'
    }} className='bg-[#f8f9fa]'>
      <div id="snackbar">Blog posted!</div>
      <Greeting />
      <div className="my-container">
        <div className="flex max-w-[64rem] mt-5 gap-[1.25rem] flex-col">
          <div className="p-[2rem] gap-4rounded-xl bg-white">
            <form onSubmit={pushDataToFirestore}>
              <input
                type="text"
                placeholder="Placeholder"
                className="input blog-title input-bordered w-full"
                required
                ref={blogTitle}
              />
              <textarea
                placeholder="What is in your mind?"
                className="textarea mt-3 ps-[1rem] pt-[0.5rem] input-bordered blog-description text-[1rem] textarea-lg w-full"
                required
                ref={blogDescription}
              />
              <div className="mt-3">
                <button
                  type="submit"
                  className="btn text-white bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                >
                  Publish Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="my-container">
        <h1 className="text-black font-semibold my-5 text-xl">My blogs</h1>
        <div className="flex gap-x-[2rem] main-wrapper justify-between">
          <div
            id="left"
            className="flex max-w-[64rem] w-[64rem] gap-[1.25rem] flex-col"
          >
            <div
              id="my-blog-wrapper"
              className="p-[1rem] flex flex-col rounded-xl bg-white"
            >
              <div className="text-center">
                {myBlogs.length > 0 && searchedBlogs.length > 0 ? searchedBlogs.map((item, index) => {
                  return <div key={item.documentId}>
                    <div className="p-[1rem] text-left flex flex-col rounded-xl bg-white">
                      <div className="flex justify-start gap-4">
                        <div>
                          <img className="rounded-xl" width="70px" src={userSelector.pfp} alt="" />
                        </div>
                        <div className="flex flex-col justify-end">
                          <div>
                            <h1 className="text-black font-semibold text-lg">
                              {item.title}
                            </h1>
                          </div>
                          <div className="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1>
                              {userSelector.name}
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
                }) : myBlogs.length > 0 ? myBlogs.map((item) => {
                  return <div key={item.id}>
                    <div className="p-[1rem] flex flex-col bg-white">
                      <div className="flex justify-start gap-4">
                        <div>
                          <img
                            className="rounded-xl"
                            width="70px"
                            src={userSelector.pfp}
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col justify-end">
                          <div>
                            <h1 className="text-black text-left font-semibold text-lg">
                              {item.title}
                            </h1>
                          </div>
                          <div className="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1>
                              {userSelector.name}
                              <span>
                                {" "}
                                - {item.time}
                              </span>
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[#6C757D] text-left">
                          {item.description}
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
      )}
export default Dashboard
