import React, { useEffect, useRef } from 'react'
import './dashboard.css'
import Greeting from '../../components/Greeting'
import { auth, db, sendData } from '../../config/firebase/firebasemethods';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { addUser } from '../../config/redux/reducers/userSlice';
const Dashboard = () => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.user.user);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, "users"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map((doc) => doc.data());
        dispatch(addUser(
          {
            user: userData[0]
          }
        ))
      } else {
        null
      }
    });
  }, [])
  const blogTitle = useRef();
  const blogDescription = useRef();
  console.log(selector);
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
        uid: selector.uid,
        pfp: selector.pfp,
        name: selector.name,
        email: selector.email
      }, "Blogs"
    )
      .then((res) => {
        console.log(res);
      })
    blogTitle.current.value = '';
    blogDescription.current.value = '';
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
        <div id="my-blog-wrapper" className="flex max-w-4xl gap-[1.25rem] flex-col">
          <div className="text-center mt-[3rem]">
            <span className="loading loading-spinner loading-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
