import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GridCards from './GridCards'
import Navbar from './Navbar'
import './index.css'
import Article from './Article'
import Footer from './Footer'

function Formulaire() {
  return <h1>Formulaire</h1>;
}

function App() {

  const [searchText, setSearchText] = useState('');

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
      <div className=''>
        <Router>
          <Navbar categories={categories} onSearch={(searchText) => setSearchText(searchText)} />
          <Routes>
            <Route path="/articles" element={<GridCards searchText={searchText} />} />
            <Route path="/homme" element={<GridCards gender="Homme" searchText={searchText} />} />
            <Route path="/femme" element={<GridCards gender="Femme" searchText={searchText} />} />
            <Route path="/formulaire" element={<Formulaire />} />
          </Routes>
        </Router>

        {/* <Article
        nameArticle={articleExample.nom_article}
        typeArticle={articleExample.categorie}
        price={articleExample.prix_article + " €"}
        images={articleExample.images}
        description={articleExample.description_article}
      /> */}
        <Footer />
      </div>

    </>
  )
}

export default App;