import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GridCards from './GridCards'
import Navbar from './Navbar'
import './index.css'
import ArticleForm from './ArticleForm';
import PreviewForm from './PreviewForm';

function App() {

  const [searchText, setSearchText] = useState('');

  function Formulaire() {
    return <h1>Formulaire</h1>;
  }

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
    },
    {
      "name": "NewFormulaire",
      "address": "/newformulaire"
    }
  ]

  return (
    <Router>
      <div>
        <Navbar categories={categories} onSearch={(searchText) => setSearchText(searchText)} />
        <Routes>
          <Route path="/articles" element={<GridCards searchText={searchText} />} />
          <Route path="/homme" element={<GridCards gender="Homme" searchText={searchText} />} />
          <Route path="/femme" element={<GridCards gender="Femme" searchText={searchText} />} />
          <Route path="/formulaire" element={<ArticleForm />} />
          <Route path="/newformulaire" element={<PreviewForm />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;