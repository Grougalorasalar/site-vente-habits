import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

function Navbar(props) {

  const categories = () => {
    let tempCategories = []
    for (let i = 0; i < props.categories.length; i++) {
      tempCategories.push(
        <li key={i}>
          <Link className="drawer-end bg-opacity-0 border-b-4 border-transparent hover:border-b-4 text-dark-grayish-blue font-semibold text-lg" to={props.categories[i].address}>
            {props.categories[i].name}
          </Link>
        </li>
      )
    }
    return tempCategories
  }

  const [searchText, setSearchText] = useState('');

  function isPlurial(nb) {
    return nb > 1 ? "s" : "";
  }

  useEffect(() => {
    props.onSearch(searchText);

  }, [searchText]);


  return (
    <div className='flex flex-col drawer-content md:px-16 md:pt-6 md:relative md:max-w-screen-xl md:mx-auto drawer'>
      <div className="w-full navbar">
        <div className="flex-none md:hidden z-20">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost drawer-button"
          >
            <svg width="16" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M16 12v3H0v-3h16Zm0-6v3H0V6h16Zm0-6v3H0V0h16Z" fill="#69707D" fillRule="evenodd" /></svg>
          </label>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
              <li key={99}>
                <Link className="drawer-end bg-opacity-0 border-b-4 border-transparent hover:border-b-4 text-dark-grayish-blue font-semibold text-lg" to={"/"}>
                  {"Accueil"}
                </Link>
              </li>
              {categories()}
            </ul>
          </div>
        </div>

        <div className="drawer-content">
          <a className="normal-case flex items-center justify-start px-10 hover:cursor-pointer" href="/">
            {/* <ReactSVG src={logoPath} /> */}
            <svg className="h-16" width="100%" height="100%" viewBox="0 0 800 600" version="1.1" xmlns="http://www.w3.org/2000/svg" fillRule='evenodd' style={{ clipRule: "evenodd", strokeMiterlimit: "1.5" }}>
              <path d="M163.027,346.374l37.1,-92.748l18.549,-0l37.038,92.686l-19.725,0.062l-5.564,-14.221l-42.047,-0l-5.564,14.221l-19.787,0Zm46.869,-68.015l-14.098,35.244l27.825,0l-13.727,-35.244Z" fillRule='nonzero' />
              <path d="M269.75,253.626l-0,92.748l68.016,0l-0,-17.313l-49.466,0l-0,-75.435l-18.55,-0Z" fillRule="nonzero" />
              <path d="M394.713,346.374c-13.191,0 -24.217,-4.441 -33.08,-13.325c-8.863,-8.883 -13.294,-19.899 -13.294,-33.049c-0,-13.191 4.431,-24.218 13.294,-33.08c8.863,-8.863 19.889,-13.294 33.08,-13.294c13.191,-0 24.218,4.431 33.081,13.294c8.862,8.862 13.294,19.889 13.294,33.08c-0,13.191 -4.432,24.218 -13.294,33.08c-8.863,8.863 -19.89,13.294 -33.081,13.294Zm0.062,-17.313c8.203,0 14.881,-2.782 20.034,-8.347c5.153,-5.565 7.729,-12.47 7.729,-20.714c-0,-8.244 -2.576,-15.149 -7.729,-20.714c-5.153,-5.565 -11.872,-8.347 -20.158,-8.347c-8.203,-0 -14.881,2.782 -20.033,8.347c-5.153,5.565 -7.729,12.47 -7.729,20.714c-0,8.244 2.576,15.149 7.729,20.714c5.152,5.565 11.872,8.347 20.157,8.347Z" fillRule='nonzero' />
              <path d="M496.18,346.374c-13.108,-0.041 -24.104,-4.483 -32.987,-13.325c-8.884,-8.842 -13.325,-19.92 -13.325,-33.234c0.041,-13.027 4.493,-23.981 13.356,-32.864c8.862,-8.884 19.848,-13.325 32.956,-13.325c13.233,-0 24.589,4.122 34.07,12.366l-12.366,13.541c-6.307,-4.946 -13.542,-7.419 -21.704,-7.419c-8.326,0.041 -15.035,2.638 -20.126,7.79c-5.091,5.153 -7.636,11.749 -7.636,19.787c0.041,8.615 2.617,15.458 7.729,20.528c5.111,5.07 11.83,7.606 20.157,7.606c6.678,-0 11.81,-1.319 15.396,-3.958l0,-15.891l-12.366,0.062l-0,-17.313l30.916,0l0,43.283c-9.44,8.244 -20.796,12.366 -34.07,12.366Z" fillRule='nonzero' />
              <path d="M590.598,346.374c-13.19,0 -24.217,-4.441 -33.08,-13.325c-8.863,-8.883 -13.294,-19.899 -13.294,-33.049c0,-13.191 4.431,-24.218 13.294,-33.08c8.863,-8.863 19.89,-13.294 33.08,-13.294c13.191,-0 24.218,4.431 33.081,13.294c8.863,8.862 13.294,19.889 13.294,33.08c-0,13.191 -4.431,24.218 -13.294,33.08c-8.863,8.863 -19.89,13.294 -33.081,13.294Zm0.062,-17.313c8.203,0 14.881,-2.782 20.034,-8.347c5.153,-5.565 7.729,-12.47 7.729,-20.714c0,-8.244 -2.576,-15.149 -7.729,-20.714c-5.153,-5.565 -11.872,-8.347 -20.157,-8.347c-8.203,-0 -14.881,2.782 -20.034,8.347c-5.153,5.565 -7.729,12.47 -7.729,20.714c-0,8.244 2.576,15.149 7.729,20.714c5.153,5.565 11.872,8.347 20.157,8.347Z" fillRule='nonzero' />
              <rect x="103.352" y="190.967" width="593.295" height="218.065" style={{ fill: "none", stroke: "#000", strokeWidth: "17px" }} />
            </svg>
          </a>
          <div className="flex-none hidden md:block">
            <ul className="menu menu-horizontal">
              {categories()}
            </ul>
          </div>
          <div>
            <SearchBar onSearch={(searchText) => setSearchText(searchText)} />
          </div>
          <div className="flex items-center justify-end flex-1 gap-4 px-2">
            <div className="dropdown dropdown-end z-10">
              <label tabIndex="0" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="badge badge-sm indicator-item">{props.basket}</span>
                </div>
              </label>
              <div tabIndex="0" className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div className="card-body">
                  <span className="font-bold text-lg">{props.basket + " article" + isPlurial(props.basket)}</span>
                  <span className="text-neutral font-semibold">{"Total : " + props.totalPrice + " €"}</span>
                  <div className="card-actions">
                    <a className="btn btn-neutral btn-block" href="/cart">Aller au panier</a>
                  </div>
                </div>
              </div>
            </div>
            {/* TODO */}
            <div className="dropdown dropdown-end z-50">
              <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    className="object-cover h-6 px-2 rounded-full cursor-pointer md:h-10 md:px-0 md:border-2 md:border-transparent md:hover:border-primary md:hover:border-2 md:hover:rounded-full"
                  />
                </div>
              </label>
              <ul tabIndex="0"
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Profil</a></li>
                <li><a>Paramètres</a></li>
                <li><a>Déconnexion</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
}

export default Navbar;