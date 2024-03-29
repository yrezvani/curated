import React from 'react';
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
            <p className="text-lg font-sans font-thin lg:bg-gray-800 lg:bg-opacity-50 text-white text-sm lg:text-xl lg:mx-48"><span>Welcome to Curated! Let us take you on an artistic journey to curate your own art gallery. <br/> Create a visual symphony of artwork and artifacts from all ages.</span></p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center space-y-0">
                <a href="#" className="inline-flex justify-center hover:text-gray-900 items-center py-1 px-5 text-base font-sans font-thin text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400 mt-2" onClick={routeChange}>
                    Explore
                </a>  
            </div>
        </div>
        </section>
    </div>
  );
}

export default Home;
