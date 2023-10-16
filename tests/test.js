var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "nom_article": "Nom de l'article",
  "prix_article": 19.99,
  "description_article": "Description de l'article",
  "tailles": [
    {
      "taille": "XS",
      "stock": 10
    },
    {
      "taille": "S",
      "stock": 15
    },
    {
      "taille": "M",
      "stock": 20
    },
    {
      "taille": "L",
      "stock": 25
    },
    {
      "taille": "XL",
      "stock": 30
    }
  ],
  "id_vendeur": 1
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3000/api/createArticle", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));