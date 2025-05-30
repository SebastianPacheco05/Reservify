// import React from 'react';

function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-[#91b2c2] h-[4.5rem] w-full fixed top-0 z-50 shadow-lg">
        <div className="flex justify-between items-center px-4 pb-3">
          <h1 className="ml-2 mt-1 text-xl md:text-2xl">Reservify</h1>
          <div className="mx-2 mt-3 cursor-pointer">
            <div className="border-2 w-6 md:w-7 my-1 border-white rounded-full" />
            <div className="border-2 w-6 md:w-7 my-1 border-white rounded-full" />
            <div className="border-2 w-6 md:w-7 my-1 border-white rounded-full" />
          </div>
        </div>
        {/* <div className="border-b-2 border-b-green-100" /> */}
      </header>

      <nav className="hidden md:block bg-blue-300 h-[20.5rem] w-full fixed top-16 rounded-b-[50px]">
        <input
          type="text"
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300 h-20 w-[340px] lg:w-[500px] xl:w-[800px] rounded-full bg-gray-400 text-2xl px-6 placeholder-black placeholder-opacity-75 placeholder:text-2xl placeholder:pl-2"
          placeholder="🔍 Busca aquí"
        />
        <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p>Tu ubicacion actual</p>
        </div>
      </nav>

      <main className="">
        <footer>{/* En desarrollo */}</footer>
      </main>
    </div>
  );
}

export default Home;
