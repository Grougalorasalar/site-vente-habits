#!/bin/bash

# Frontend
echo -e "\n" | npx create-vite frontend --template react
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Remplacer le contenu de tailwind.config.js
cat > tailwind.config.js <<EOL
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# Remplacer le contenu de index.css
cat > src/index.css <<EOL
@tailwind base;
@tailwind components;
@tailwind utilities
EOL

#Ajouter le fichier Message.js
cat > src/Message.jsx <<EOL
import React, { useEffect, useState } from 'react';

function Message() {
    const [message, setMessage] = useState('');
    useEffect(() => {
        fetch('/api')
            .then((res) => res.json())
            .then((data) => {
                setMessage(data[0] + ' ' + data[1] + ' ' + data[2]);
            });
    }, []);


  return (
    <div>
      <h1>Hello World Message</h1>
      <p>{message}</p>
    </div>
  );
}

export default Message;
EOL

# Remplacer le contenu de App.jsx
cat > src/App.jsx <<EOL
import React, { useState } from 'react'
import Message from './Message'

function Counter() {
   const [count, setCount] = useState(0)

   const increment = () => {
      setCount(count + 1)
   }

   const decrement = () => {
      setCount(count - 1)
   }

   return (
      <div className="m-2">
         <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src="https://placekitten.com/200/100" />
            <div className="px-6 py-4">
               <div className="font-bold text-xl mb-2">Compteur</div>
               <p className="text-gray-700 text-5xl">
                  {count}
               </p>
            </div>
            <div className="px-6 pt-4 pb-2">
               <button type="button" onClick={increment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Incrémenter
               </button>
               <button type="button" onClick={decrement} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Décrémenter
               </button>
            </div>
         </div>
         <div className="m-2">
          <Message />
      </div>
      </div>

   )
}

export default Counter
EOL

# Modifier le fichier vite.config.js
cat > vite.config.js <<EOL
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server : {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  plugins: [react()]
});
EOL

# Backend
cd ..
mkdir backend
cd backend
npm init es6 -y
npm install express
npm install prisma
npx prisma init
npm install nodemon --save-dev

# Vérifier si jq est déjà installé
if ! command -v jq &> /dev/null; then
    echo "jq n'est pas installé. Installation en cours..."
    sudo apt-get install jq
else
    echo "jq est déjà installé."
fi


# Ajouter la commande "dev" dans les scripts de package.json du backend
jq '.scripts.dev = "npx nodemon backend.js"' package.json > tmp.json && mv tmp.json package.json

# Remplacer le contenu du fichier schema.prisma
cat > prisma/schema.prisma <<EOL
generator client {
   provider = "prisma-client-js"
}

datasource db {
   provider = "sqlite"
   url      = "file:./dev.db"
}

model Message {
  id    Int    @id @default(autoincrement())
  text  String
}
EOL

cat > backend.js <<EOL
import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const port = 3000;

const prisma = new PrismaClient()

app.get('/', (req, res) => {
   res.send('Hello World, from express');
});

app.get('/api', (req, res) => {
   //retrive all data from message table
   prisma.message.findMany().then((result) => {
      //send only the "text" field
      res.send(result.map((message) => message.text));
   });
});

app.listen(port, function () {
   console.log("Server listening on port " + port)
 })
EOL

# Appliquer les migrations
npx prisma migrate dev --name init

# Indiquer au client comment démarrer l'application
echo ""
echo "🚀 Installation terminée ! 🚀"
echo ""
echo "Pour lancer l'application, suivez ces étapes :"
echo ""
echo "Frontend :"
echo "1. Ouvrez un terminal et naviguez dans le répertoire du frontend :"
echo "   cd frontend"
echo "2. Exécutez la commande suivante pour démarrer le frontend :"
echo "   npm run dev"
echo "3. Votre application frontend sera accessible à l'adresse http://localhost:5173"
echo ""
echo "Backend :"
echo "1. Ouvrez un autre terminal et naviguez dans le répertoire du backend :"
echo "   cd backend"
echo "2. Exécutez la commande suivante pour démarrer le backend :"
echo "   npm run dev"
echo "3. Votre backend sera accessible à l'adresse http://localhost:3000"
echo ""
echo "Profitez de votre développement ! 🖥️"

echo "Installation terminée !"
