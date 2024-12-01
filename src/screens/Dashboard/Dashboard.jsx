import React, { useEffect, useRef, useState } from 'react'
import './dashboard.css'
import Greeting from '../../components/Greeting'
import { auth, db, deleteDocument, getData, sendData } from '../../config/firebase/firebasemethods';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../config/redux/reducers/userSlice';
import { doc, updateDoc } from 'firebase/firestore';
const Dashboard = () => {
  const [myIndex, setMyIndex] = useState(0);
  const [blogTitleToEdit, setBlogTitleToEdit] = useState('')
  const [blogDescriptionToEdit, setBlogDescriptionToEdit] = useState('')
  const [gotData, setGotData] = useState(false);
  const [searchedBlogs, setSearchedBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const inputSearch = useRef();
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
    if (!userSelector) {
      try {
        (async () => {
          await getData("users", auth.currentUser.uid)
            .then(arr => {
              dispatch(addUser(
                {
                  user: arr
                }
              ))
            })
          await getData("blogs", auth.currentUser.uid)
            .then(arr => {
              setMyBlogs(arr)
            })
            .catch(err => {
              setGotData(true);
              console.log(err);
            })
        })()
      } catch (error) {
        console.log(error);
      }
    }
  }, []);


  const getCurrentTime = () => {
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
    return `${months[currentMonth]} ${correctedDate}, ${currentYear}`
  }


  const pushDataToFirestore = async (event) => {
    event.preventDefault();
    const formattedTime = getCurrentTime()
    try {
      await sendData(
        {
          title: blogTitle.current.value,
          description: blogDescription.current.value,
          time: formattedTime,
          uid: userSelector.uid,
          pfp: userSelector.pfp,
          name: userSelector.name,
          email: userSelector.email
        }, "blogs")
        .then((res) => {
          console.log(res);
        });
      await getData("blogs", auth.currentUser.uid)
        .then(arr => {
          setMyBlogs(arr)
        })
    } catch (error) {
      console.log(error);
    }
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


  const deleteBlog = async (i, id) => {
    myBlogs.length === 1 ? setGotData(true) : null
    try {
      await deleteDocument(id, 'blogs')
        .then(res => {
          console.log(res);
          myBlogs.splice(i, 1);
          setMyBlogs([...myBlogs]);
        })
    } catch (error) {
      console.log(err);
    }
  };


  const editBlog = async (event) => {
    event.preventDefault();
    const formattedTime = `Edited at ${getCurrentTime()}`;
    const updatedBlogs = [...myBlogs];
    updatedBlogs[myIndex].title = blogTitleToEdit;
    updatedBlogs[myIndex].description = blogDescriptionToEdit;
    updatedBlogs[myIndex].time = formattedTime;
    setMyBlogs(updatedBlogs);
    setBlogTitleToEdit('');
    setBlogDescriptionToEdit('');
    const updateRef = doc(db, "blogs", updatedBlogs[myIndex].id);
    const updatedData = {
      title: blogTitleToEdit,
      description: blogDescriptionToEdit,
      time: formattedTime,
    };
    try {
      await updateDoc(updateRef, updatedData);
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    document.getElementById("my_modal_2").close();
  };


  const showModal = (index) => {
    setBlogTitleToEdit(myBlogs[index].title);
    setBlogDescriptionToEdit(myBlogs[index].description);
    console.log(myBlogs[index].title);
    setMyIndex(index);
    document.getElementById('my_modal_2').showModal();
  };


  return (
    <div style={{
      minHeight: '100vh'
    }} className='bg-[#f8f9fa]'>
      <div id="snackbar">Blog posted!</div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box bg-white">
          <div className="gap-4 rounded-xl bg-white">
            <form method="dialog" className="modal-backdrop" onSubmit={editBlog}>
              <input
                type="text"
                placeholder="Edit Blog Title"
                value={blogTitleToEdit}
                onChange={(e) => setBlogTitleToEdit(e.target.value)}
                className="input text-[#6c757d] input-bordered w-full"
                required
              />
              <textarea
                value={blogDescriptionToEdit}
                onChange={(e) => setBlogDescriptionToEdit(e.target.value)}
                placeholder="Edit Blog Description"
                className="textarea mt-3 ps-[1rem] text-[#6c757d] pt-[0.5rem] input-bordered text-[1rem] textarea-lg w-full"
                required
              />
              <div className="mt-3">
                <button
                  type="submit"
                  className="btn text-white postBtn bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
                >
                  Edit Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <Greeting />
      <div className="my-container">
        <div className="flex mt-5 gap-[1.25rem] flex-col">
          <div className="p-[2rem] blogPostWrapper gap-4 rounded-xl bg-white">
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
                  className="btn text-white postBtn bg-[#7749f8] border-[#7749f8] btn-active hover:bg-[#561ef3] btn-neutral"
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
        <div className="flex gap-x-[2rem] main-wrapperDash justify-between">
          <div
            id="leftDash"
            className="flex max-w-[64rem] w-[64rem] gap-[1.25rem] flex-col"
          >
            <div
              id="my-blog-wrapper"
              className="p-[1rem] mb-[20px] flex flex-col rounded-xl bg-white"
            >
              <div className="text-center">
                {myBlogs.length > 0 && searchedBlogs.length > 0 ? searchedBlogs.map((item, index) => {
                  return <div key={item.documentId}>
                    <div className="p-[1rem] text-left flex flex-col rounded-xl bg-white">
                      <div className="flex justify-start blogWrapper gap-4">
                        <div>
                          <img className="rounded-xl blogImg" width="70px" src={userSelector.pfp} alt="" />
                        </div>
                        <div className="flex flex-col justify-end">
                          <div>
                            <h1 className="text-black font-semibold text-lg">
                              {item.title}
                            </h1>
                          </div>
                          <div className="text-[#6C757D] mb-[3px] font-medium flex gap-2 ">
                            <h1 className='blogTime'>
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
                      <div className="mt-3 flex justify-start gap-3 items-center">
                        <p onClick={() => showModal(index)} id="seeAll" className="text-[#7749f8] cursor-pointer font-semibold">
                          <span>Edit</span>
                        </p>
                        <p onClick={() => deleteBlog(index, item.id)} id="seeAll" className="text-[#7749f8] cursor-pointer font-semibold">
                          <span>Delete</span>
                        </p>
                      </div>
                    </div>
                  </div>
                }) : myBlogs.length > 0 ? myBlogs.map((item, index) => {
                  return <div key={item.id}>
                    <div className="p-[1rem] flex flex-col bg-white">
                      <div className="flex justify-start blogWrapper gap-4">
                        <div>
                          <img
                            className="rounded-xl blogImg"
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
                            <h1 className='blogTime'>
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
                      <div className="mt-3 flex justify-start gap-3 items-center">
                        <p onClick={() => showModal(index)} id="seeAll" className="text-[#7749f8] cursor-pointer font-semibold">
                          <span>Edit</span>
                        </p>
                        <p onClick={() => deleteBlog(index, item.id)} id="seeAll" className="text-[#7749f8] cursor-pointer font-semibold">
                          <span>Delete</span>
                        </p>
                      </div>
                    </div>
                  </div>
                }) : gotData && myBlogs.length === 0 ? <h1 className='font-semibold my-6 text-xl text-black'>No Blogs Found...</h1> : <span className="loading my-6 loading-spinner loading-lg" />}
              </div>
            </div>
          </div>
          <div id="sidebarDash">
            <div className="flex mb-5 justify-center">
              <div className="group">
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
                <input onInput={searchBlogs} placeholder="Search" type="search" className="input-search" ref={inputSearch} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
