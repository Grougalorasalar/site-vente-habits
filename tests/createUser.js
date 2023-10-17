var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "sessionID": "",
  "pseudo": "votrePseudo",
  "nom": "votreNom",
  "prenom": "votrePrenom",
  "password": "votreMotDePasse",
  "email": "votreEmail",
  "adresse": "votreAdresse",
  "telephone": "votreTelephone"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3000/api/createUser", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));