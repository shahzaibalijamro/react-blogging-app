import React, { useEffect, useRef, useState } from 'react'
import '../Home/style.css'
import Greeting from '../../components/Greeting'
import { getData } from '../../config/firebase/firebasemethods';
const SingleUser = () => {
  const inputSearch = useRef();
  const singleUser = JSON.parse(localStorage.getItem('singleUser'));
  const[singleUserBlogs,setSingleUserBlogs] = useState([]);
  const [searchedBlogs,setSearchedBlogs] = useState([]);
  console.log(singleUser);
  useEffect(()=>{
    getData("blogs", singleUser.uid)
    .then(arr => setSingleUserBlogs(arr))
    .catch(err =>{
      alert(err)
    })
  },[])
  const searchBlogs = () => {
    const searchValue = inputSearch.current.value.toLowerCase();
    const filteredArr = singleUserBlogs.filter(item => {
        return item.title.toLowerCase().includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue);
    });
    setSearchedBlogs(filteredArr)
  }
  return (
    <div style={{
      minHeight: '100vh'
    }}>
      <Greeting />
      <div className="my-container">
        <h1 className="text-black font-semibold my-5 text-xl">All blogs</h1>
        <div className="flex gap-x-[2rem] justify-between">
          <div className="flex max-w-[64rem] w-[64rem] gap-[1.25rem] flex-col">
            <div
              id="my-blog-wrapper"
              className="p-[1.3rem] flex flex-col rounded-xl bg-white"
            >
              <div className="text-center">
                {singleUserBlogs.length > 0 && searchedBlogs.length > 0 ? searchedBlogs.map((item, index) => {
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
                        <p onClick={() => goToSinglePage(index)} id="seeAll" className="text-[#7749f8] cursor-pointer font-semibold">
                          <span>see all from this user</span>
                        </p>
                      </div>
                    </div>
                  </div>
                }) : singleUserBlogs.length > 0 ? singleUserBlogs.map((item,index)=>{
                  return <div key={item.id}>
                  <div className="p-[1.3rem] text-left flex flex-col rounded-xl bg-white">
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
            {singleUser ? <>
              <h1 className="font-semibold text-end text-black text-xl">
                {singleUser.email}
              </h1>
              <h1 className="font-bold text-3xl text-end text-[#7749f8]">
                {singleUser.name}
              </h1>
              <div className="flex mt-4 justify-end">
                <img className="rounded-xl" width="200px" src={singleUser.pfp} alt="" />
              </div>
            </> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleUser