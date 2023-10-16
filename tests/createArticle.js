var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "sessionID": "",
  "action": "CreateArticle",
  "nom_article": "Nouvel article",
  "prix_article": 24.99,
  "description_article": "Ceci est la description de mon nouvel article",
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
  "images": [
    {
      "url": "https://example.com/image1.jpg"
    },
    {
      "url": "https://example.com/image2.jpg"
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

fetch("http://localhost:3000/api", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));