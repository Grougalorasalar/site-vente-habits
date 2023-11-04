import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

function Navbar(props) {

  const categories = () => {
    let tempCategories = []
    for (let i = 0; i < props.categories.length; i++) {
      tempCategories.push(
        <li key={i}>
          <Link className="bg-opacity-0 border-b-4 border-transparent hover:border-b-4 text-dark-grayish-blue font-semibold text-lg" to={props.categories[i].address}>
            {props.categories[i].name}
          </Link>
        </li>
      )
    }
    return tempCategories
  }

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    props.onSearch(searchText);
  }
    , [searchText]);

  return (
    <div className='flex flex-col drawer-content md:px-16 md:pt-6 md:relative md:max-w-screen-xl md:mx-auto'>
      <div className="w-full navbar">
        <div className="flex-none md:hidden">
          <label
            htmlFor="my-drawer-3"
            className="btn btn-square btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
              //   toggleDrawer(true);
            }}
          >
            {/* <ReactSVG src={menuPath} /> */}
            <svg width="16" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M16 12v3H0v-3h16Zm0-6v3H0V6h16Zm0-6v3H0V0h16Z" fill="#69707D" fillRule="evenodd" /></svg>
          </label>
        </div>
        <div className="btn btn-ghost normal-case flex items-center justify-start px-10">
          {/* <ReactSVG src={logoPath} /> */}
          <svg width="100%" height="100%" viewBox="0 0 800 600" version="1.1" xmlns="http://www.w3.org/2000/svg" fillRule='evenodd' style={{ clipRule: "evenodd", strokeMiterlimit: "1.5" }}>
            <path d="M163.027,346.374l37.1,-92.748l18.549,-0l37.038,92.686l-19.725,0.062l-5.564,-14.221l-42.047,-0l-5.564,14.221l-19.787,0Zm46.869,-68.015l-14.098,35.244l27.825,0l-13.727,-35.244Z" fillRule='nonzero' />
            <path d="M269.75,253.626l-0,92.748l68.016,0l-0,-17.313l-49.466,0l-0,-75.435l-18.55,-0Z" fillRule="nonzero" />
            <path d="M394.713,346.374c-13.191,0 -24.217,-4.441 -33.08,-13.325c-8.863,-8.883 -13.294,-19.899 -13.294,-33.049c-0,-13.191 4.431,-24.218 13.294,-33.08c8.863,-8.863 19.889,-13.294 33.08,-13.294c13.191,-0 24.218,4.431 33.081,13.294c8.862,8.862 13.294,19.889 13.294,33.08c-0,13.191 -4.432,24.218 -13.294,33.08c-8.863,8.863 -19.89,13.294 -33.081,13.294Zm0.062,-17.313c8.203,0 14.881,-2.782 20.034,-8.347c5.153,-5.565 7.729,-12.47 7.729,-20.714c-0,-8.244 -2.576,-15.149 -7.729,-20.714c-5.153,-5.565 -11.872,-8.347 -20.158,-8.347c-8.203,-0 -14.881,2.782 -20.033,8.347c-5.153,5.565 -7.729,12.47 -7.729,20.714c-0,8.244 2.576,15.149 7.729,20.714c5.152,5.565 11.872,8.347 20.157,8.347Z" fillRule='nonzero' />
            <path d="M496.18,346.374c-13.108,-0.041 -24.104,-4.483 -32.987,-13.325c-8.884,-8.842 -13.325,-19.92 -13.325,-33.234c0.041,-13.027 4.493,-23.981 13.356,-32.864c8.862,-8.884 19.848,-13.325 32.956,-13.325c13.233,-0 24.589,4.122 34.07,12.366l-12.366,13.541c-6.307,-4.946 -13.542,-7.419 -21.704,-7.419c-8.326,0.041 -15.035,2.638 -20.126,7.79c-5.091,5.153 -7.636,11.749 -7.636,19.787c0.041,8.615 2.617,15.458 7.729,20.528c5.111,5.07 11.83,7.606 20.157,7.606c6.678,-0 11.81,-1.319 15.396,-3.958l0,-15.891l-12.366,0.062l-0,-17.313l30.916,0l0,43.283c-9.44,8.244 -20.796,12.366 -34.07,12.366Z" fillRule='nonzero' />
            <path d="M590.598,346.374c-13.19,0 -24.217,-4.441 -33.08,-13.325c-8.863,-8.883 -13.294,-19.899 -13.294,-33.049c0,-13.191 4.431,-24.218 13.294,-33.08c8.863,-8.863 19.89,-13.294 33.08,-13.294c13.191,-0 24.218,4.431 33.081,13.294c8.863,8.862 13.294,19.889 13.294,33.08c-0,13.191 -4.431,24.218 -13.294,33.08c-8.863,8.863 -19.89,13.294 -33.081,13.294Zm0.062,-17.313c8.203,0 14.881,-2.782 20.034,-8.347c5.153,-5.565 7.729,-12.47 7.729,-20.714c0,-8.244 -2.576,-15.149 -7.729,-20.714c-5.153,-5.565 -11.872,-8.347 -20.157,-8.347c-8.203,-0 -14.881,2.782 -20.034,8.347c-5.153,5.565 -7.729,12.47 -7.729,20.714c-0,8.244 2.576,15.149 7.729,20.714c5.153,5.565 11.872,8.347 20.157,8.347Z" fillRule='nonzero' />
            <rect x="103.352" y="190.967" width="593.295" height="218.065" style={{ fill: "none", stroke: "#000", strokeWidth: "17px" }} />
          </svg>
        </div>
        <div className="flex-none hidden md:block">
          <ul className="menu menu-horizontal">
            {categories()}
          </ul>
        </div>
        <div>
          <SearchBar onSearch={(searchText) => setSearchText(searchText)} />
        </div>
        <div className="flex items-center justify-end flex-1 gap-4 px-2">
          <div className="indicator">
            {/* TODO */}

            <svg width="22" height="20" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" onClick={(e) => {
              e.stopPropagation();
            }}>
              <path d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z" fill="#69707D" fillRule="nonzero" />
            </svg>
          </div>
          {/* TODO */}
          <img
            alt="User avatar"
            className="object-cover h-6 px-2 rounded-full cursor-pointer md:h-10 md:px-0 md:border-2 md:border-transparent md:hover:border-primary md:hover:border-2 md:hover:rounded-full"
          />
        </div>
      </div>
    </div >
  );
}

export default Navbar;