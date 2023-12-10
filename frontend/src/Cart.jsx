import React, { useState, useEffect } from 'react';
import { nbItemsInBasket, calcTotalPrice } from './Utils'

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

    useEffect(() => {
        getFirstImage(props.itemCart.id)
    }, [])


    return (
        <div className='grid grid-cols-4 gap-4 mb-9' key={props.itemCart.id}>
            <div className='col-span-1 '>
                <img className='rounded-xl' src={firstImageUrl} />
            </div>
            <div className='col-span-2 '>
                <h2 className='font-extrabold text-xl mb-2'>{props.itemCart.nom_article}</h2>
                <span className="badge mb-2">{props.itemCart.categorie}</span>
                <p className='font-semibold text-base mb-2'>{props.itemCart.description_article}</p>
                <p>{"Quantité : " + props.itemCart.quantity}</p>
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
                articleItems.push(<ArticleCart itemCart={element} />)
                console.log(element);
            })
        }
        if (articleItems.length == 0 || !Array.isArray(basket)) {
            return (
                <p className='font-bold p-4 text-3xl text-gray-400'>Panier vide.</p>
            )
        }

        return articleItems
    }

    return (
        <>
            <section className='grid grid-cols-3 w-fit justify-items-center justify-center m-auto'>
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