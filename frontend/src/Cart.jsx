import React, { useState, useEffect } from 'react';
import { nbItemsInBasket, calcTotalPrice, removeArticleInBasket, changeQuantity } from './Utils'

function ArticleCart(props) {

    const apiUrl = '/api/images/';
    const [firstImageUrl, setFirstImageUrl] = useState('')

    async function getFirstImage(id) {
        await fetch(apiUrl + id)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setFirstImageUrl(data.images[0].url);
            })
    }

    const listQuantity = () => {
        let quantity = []
        for (let i = 1; i <= 20; i++) {
            quantity.push(<li><a onClick={() => changeQuantity(props.itemCart.id, i, props.setBasket, props.setTotalPrice)}>{i}</a></li >)
        }
        return quantity
    }

    useEffect(() => {
        getFirstImage(props.itemCart.id)
    }, [props.itemCart])


    return (
        <div className='grid grid-cols-4 gap-4 mb-9' key={props.itemCart.nom_article + "-" + props.itemCart.id}>
            <div className='col-span-1 '>
                <img className='rounded-xl' src={firstImageUrl} />
            </div>
            <div className='col-span-2 '>
                <h2 className='font-extrabold text-xl mb-2'>{props.itemCart.nom_article}</h2>
                <span className="badge mb-2">{props.itemCart.categorie}</span>
                <p className='font-semibold text-base mb-2'>{props.itemCart.description_article}</p>
                <div className='dropdown mr-2 z-'>
                    <p className='z-0' tabIndex={0} role='button'>{"Quantité : " + props.itemCart.quantity}</p>
                    <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
                        {
                            listQuantity()
                        }
                    </ul>
                </div>
                <a className='btn btn-circle btn-ghost' onClick={() => removeArticleInBasket(props.itemCart.id, props.setBasket, props.setTotalPrice)}>
                    <svg className='' aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
                        <path stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" d="M14.25 7.5v12m-4.5-12v12M5.25 6v13.5c0 1.24 1.01 2.25 2.25 2.25h9c1.24 0 2.25-1.01 2.25-2.25V5.25h2.75m-2.75 0H21m-12-3h5.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H3"></path>
                    </svg>
                </a>
            </div>
            <div className='col-span-1 '>
                <p className='text-left font-semibold'>{props.itemCart.prix_article + "€"}</p>
            </div>
        </div>
    )
}

function Cart(props) {

    function getArt() {
        var articleItems = []
        var basket = JSON.parse(localStorage.getItem("basket"));

        if (Array.isArray(basket)) {
            JSON.parse(localStorage.getItem("basket")).forEach(element => {
                articleItems.push(<ArticleCart itemCart={element} setBasket={props.setBasket} setTotalPrice={props.setTotalPrice} />)
                console.log(element);
            })
        }
        if (articleItems.length == 0 || !Array.isArray(basket)) {
            return (
                <p className='font-bold p-4 text-1xl text-gray-400 ml-2'>Panier vide.</p>
            )
        }

        return articleItems
    }

    return (
        <>
            <section className='grid md:grid-cols-3 xs:grid-cols-1 w-fit justify-items-center justify-center m-auto' id='cart'>
                <div className='col-span-2 max-w-3xl'>
                    <h2 className='font-bold p-4 text-3xl'>Panier</h2>
                    {getArt()}
                </div>
                <div className='col-span-1'>
                    <h2 className='font-bold p-4 text-3xl'>Récapitulatif</h2>
                    <h2 className='font-bold p-4 text-xl'>{"Total : " + props.totalPrice + " €"}</h2>
                    <button className='btn btn-neutral rounded-full w-72 mt-5' >Paiement</button>
                </div>

            </section>
        </>
    )
}

export default Cart;