import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GridCards from './GridCards'
import Navbar from './Navbar'
import './index.css'
import PreviewForm from './PreviewForm'
import Footer from './Footer'
import Cart from './Cart'
import { nbItemsInBasket, calcTotalPrice } from './Utils'

function App() {
  const [searchText, setSearchText] = useState('');
  const [basket, setBasket] = useState(nbItemsInBasket());
  const [totalPrice, setTotalPrice] = useState(calcTotalPrice());

  const categories = [
    {
      "name": "Articles",
      "address": "/articles"
    },
    {
      "name": "Homme",
      "address": "/homme"
    },
    {
      "name": "Femme",
      "address": "/femme"
    },
    {
      "name": "Formulaire",
      "address": "/formulaire"
    }
  ]

  const articleExample = {
    "id": 1,
    "nom_article": "Nike Sportswear Tech Fleece",
    "prix_article": 83.99,
    "description_article": "Chaleur et style en toute simplicité : découvrez le sweat à capuche Nike Sportswear Tech Fleece.",
    "id_vendeur": 1,
    "marque": "Nike",
    "genre": "Homme",
    "categorie": "Sweat",
    "couleur": "Noir",
    "images": [
      "/api/images/1/1/1/1698862241230-104166277.png",
      "/api/images/1/1/1/1698862241237-734167684.png",
      "/api/images/1/1/1/1698862241255-699973711.jpg"
    ]
  };

  return (
    <>
      <Router>
        <Navbar categories={categories} basket={basket} totalPrice={totalPrice} onSearch={(searchText) => setSearchText(searchText)} />
        <Routes>
          <Route path="/articles" element={<GridCards searchText={searchText} />} />
          <Route path="/homme" element={<GridCards gender="Homme" searchText={searchText} />} />
          <Route path="/femme" element={<GridCards gender="Femme" searchText={searchText} />} />
          <Route path="/formulaire" element={<PreviewForm />} />
          <Route path="/cart" element={<Cart totalPrice={totalPrice} setBasket={setBasket} setTotalPrice={setTotalPrice} />} />
        </Routes>
      </Router>

      {/* <Article
        id={articleExample.id}
        nameArticle={articleExample.nom_article}
        typeArticle={articleExample.categorie}
        price={articleExample.prix_article + " €"}
        images={articleExample.images}
        description={articleExample.description_article}
        setBasket={setBasket}
        setTotalPrice={setTotalPrice}
      /> */}
      <div className='h-60'></div>
      <Footer />
    </>
  )
}

export default App;