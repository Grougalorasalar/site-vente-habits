import React, { useState } from 'react'
import CardImages from './CardImages'


function Card(props) {

    const isSold = () => {
        if (props.soldPrice) {
            return (
                <del>
                    <span className="text-sm text-gray-600 cursor-auto ml-2 font-medium">$199</span>
                </del>
            )
        }
    }

    return (
        <div className="group card glass w-96 bg-base-100 shadow-xl roundered-xl" >
            <CardImages images={props.images} unique={props.nameArticle} articleLink={props.articleLink} />
            <div className='card-body'>
                <span className="badge">{props.typeArticle || "Product Type"}</span>
                <h2 className="card-title">
                    {props.nameArticle || "Product Name"}
                    {/* <div className="badge badge-secondary">NEW</div> */}
                </h2>
                <p>{props.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit."}</p>
                <p className='text-left font-semibold flex'>{props.price || "$149"} {isSold()}</p>
            </div>
        </div>
    )
}

export default Card
