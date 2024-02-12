import React from 'react';
import "./Home.css"
import { useNavigate } from 'react-router-dom';

function Home() {
  let navigate = useNavigate(); 

  const routeChange = () =>{ 
    let path = `/explorer`; 
    navigate(path);
  }

  return (
    <div className="home-container">
        <section className="bg-center bg-no-repeat bg-[url('../curated-home3.jpg')] bg-slate-400 bg-blend-multiply h-svh w-screen">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
            <h1 className="mb-4 text-4xl font-thin font-heading tracking-tight leading-none text-white md:text-7xl lg:text-8xl">CURATED</h1>
            <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">• find your favourites in our catologue • find something new in our explorer • find your CURATE-ivity in <u>your</u> gallery •</p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
                <a href="#" className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400" onClick={routeChange}>
                    Explore
                </a>  
            </div>
        </div>
        </section>
    </div>
  );
}

export default Home;
