export const nbItemsInBasket = () => {
    var basket = JSON.parse(localStorage.getItem("basket"));
    var nbArticles = 0;

    if (Array.isArray(basket)) {
        basket.forEach((element) => {
            nbArticles = nbArticles + element.quantity;
        })
    }
    return nbArticles;
}

export const calcTotalPrice = () => {
    var basket = JSON.parse(localStorage.getItem("basket"));
    var total = 0;

    if (Array.isArray(basket)) {
        basket.forEach((element) => {
            total = total + element.quantity * element.prix_article
        })
    }

    return total.toFixed(2);
}

export const isInBasket = (id) => {
    var basket = JSON.parse(localStorage.getItem("basket"));
    var temoin = false;

    if (Array.isArray(basket)) {
        JSON.parse(localStorage.getItem("basket")).forEach(function (elt, i) {
            if (elt.id == id) {
                temoin = i
            }
        })
    }
    return temoin
}

export const addBasket = (id, setBasket, setTotalPrice) => {
    const apiUrl = '/api/articles';

    fetch(apiUrl + "/" + id)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            var verify = isInBasket(id)
            var basket = JSON.parse(localStorage.getItem("basket"))

            if (!Number.isInteger(verify)) {
                data.article.quantity = 1
                if (Array.isArray(basket)) {
                    basket.push(data.article)
                    localStorage.setItem("basket", JSON.stringify(basket))
                } else {
                    localStorage.setItem("basket", JSON.stringify([data.article]))
                }
            } else {
                basket[verify].quantity = basket[verify].quantity + 1
                localStorage.setItem("basket", JSON.stringify(basket))
            }
            setBasket(nbItemsInBasket());
            setTotalPrice(calcTotalPrice());
        })
}

export const removeArticleInBasket = (id, setBasket, setTotalPrice) => {
    var basket = JSON.parse(localStorage.getItem("basket"));
    if (Array.isArray(basket)) {
        JSON.parse(localStorage.getItem("basket")).forEach(function (elt, i) {
            if (elt.id == id) {
                if (basket.length == 1) {
                    localStorage.setItem("basket", JSON.stringify(basket.pop()))
                } else {
                    localStorage.setItem("basket", JSON.stringify(basket.splice(i - 1, 1)))
                }
                setBasket(nbItemsInBasket())
                setTotalPrice(calcTotalPrice())
            }
        })
    }
}

export const changeQuantity = (id, newQuantity, setBasket, setTotalPrice) => {
    var basket = JSON.parse(localStorage.getItem("basket"));
    console.log("dd")
    if (Array.isArray(basket)) {
        JSON.parse(localStorage.getItem("basket")).forEach(function (elt, i) {
            if (elt.id == id) {
                basket[i].quantity = newQuantity
                localStorage.setItem("basket", JSON.stringify(basket))
                setBasket(nbItemsInBasket())
                setTotalPrice(calcTotalPrice())
            }
        })
    }
}