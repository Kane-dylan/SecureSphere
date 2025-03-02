import React from "react";
import { auth, Provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import { Helmet } from "react-helmet";

const Cookie = new Cookies();
const Auth = ({ setisAuth }) => {
  const signin = async () => {
    try {
      const result = await signInWithPopup(auth, Provider);
      Cookie.set("auth-token", result.user.refreshToken);
      console.log(result.user.photoURL);
      setisAuth(true);
    } catch (err) {
      console.log("error");
    }
  };

  const backgroundImageStyle = {
    backgroundImage: 'url("img.jpeg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div
    
      className="flex justify-center items-center"
    >
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="w-2/3 bg-neutral-400/60 p-8 rounded md:rounded-lg shadow-lg text-center font-Newsreader text-wrap ">
        <h1 className="text-3xl font-semibold font-Newsreader  mb-4">Welcome to <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-200 to-red-300 text-transparent bg-clip-text whitespace-nowrap">SecureSphere</span>!</h1>
        <p className="text-m mb-4 font-Newsreader">
          SecureSphere is a user-friendly chat application designed to facilitate
          seamless communication among friends and users within a shared virtual
          space.
        </p>
        <p className="text-2xl font-semibold mb-4">Sign in to enter the room</p>
        <button
          onClick={signin}
          className="bg-blue-600 hover:bg-slate-300 text-white hover:text-black py-2 px-4 rounded-full transition duration-300 ease-in-out transform "
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Auth;
