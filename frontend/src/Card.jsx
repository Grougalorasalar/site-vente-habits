import React, { useState } from 'react'


function Card(props) {

    const isSold = () => {
        if (props.soldPrice) {
            return (
                <del>
                    <p className="text-sm text-gray-600 cursor-auto ml-2">$199</p>
                </del>
            )
        }
    }

  return(
    <div className="card glass w-96 bg-base-100 shadow-xl">
  <figure className='max-h-96 max-w-sm'  ><img src="https://i.pinimg.com/736x/21/1b/ba/211bba0c601e5d98e90ca0d361f5ce2a.jpg" alt="Shoes" /></figure>
  <div className="card-body">
  <span className="badge">{props.typeArticle || "Brand"}</span>
    <h2 className="card-title">
    {props.nameArticle || "Product Name"}
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p className='text-right'>{props.price || "$149"} {isSold()}</p>
    
               <div className="card-actions justify-end">
             <button className="btn" href="#">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">
                     <path fillRule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                     <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                 </svg>
               </button>
             </div>
  </div>
</div>
  )
}

export default Card