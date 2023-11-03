import React from 'react'
import ReactDOM from 'react-dom/client'
import GridCards from './GridCards'
import Navbar from './Navbar'
import './index.css'

const categories = [
  {
    "name": "Homme",
    "address": "#homme"
  },
  {
    "name": "Femme",
    "address": "#femme"
  },
  {
    "name": "A propos",
    "address": "#propos"
  },
  {
    "name": "Contact",
    "address": "#contact"
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar categories={categories} />
    <GridCards />
  </React.StrictMode>,
)
