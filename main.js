'use strict';

const rissotoRecipeURL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';

const cardTitleEl = document.querySelector('.card__title');
const cardArticleListEl = document.querySelector('.card__article-list');
let recipeCheckboxes = [];
const totalItemsEl = document.querySelector('.card__items--total');
const subtotalPriceEl = document.querySelector('.card__subtotal--total');
const totalPriceEl = document.querySelector('.card__total--total');
const shippingPriceEl = document.querySelector('.card__shipping-cost--total');
let totalItems = 0;
let totalPrice = 0;
const shippingPrice = 7;
setPurchaseValues();

function setPurchaseValues() {
    totalItemsEl.innerHTML = totalItems;
    subtotalPriceEl.innerHTML = `${totalPrice.toFixed(2)} €`;
    shippingPriceEl.innerHTML = `${shippingPrice.toFixed(2)} €`;
    totalPriceEl.innerHTML = totalItems !== 0 ? `${(totalPrice + shippingPrice).toFixed(2)} €` : `${totalPrice.toFixed(2)} €`;
}

function handleRecipeCheckbox(event) {
    const selectedCheckbox = event.currentTarget.checked;
    const selectedItems = parseInt(document.querySelector(`p[data-amount=${event.currentTarget.id}]`).innerHTML);
    const selectedPrice = parseFloat(document.querySelector(`p[data-price=${event.currentTarget.id}]`).innerHTML.replace(new RegExp(' €', 'g'), ''));

    if (selectedCheckbox) {
        totalItems += parseInt(selectedItems);
        totalPrice += parseFloat(selectedPrice);
    } else {
        totalItems -= parseInt(selectedItems);
        totalPrice -= parseFloat(selectedPrice);
    }

    setPurchaseValues();
}

function createRecipeCard(object) {

    const cardTitle = document.createTextNode(object.name);
    cardTitleEl.appendChild(cardTitle);

    for (let i = 0; i < object.ingredients.length; i++) {

        const articleContainerEl = document.createElement('div');
        const articleTitleEl = document.createElement('h3');
        const articleBrandEl = document.createElement('h4');
        const articleWeightEl = document.createElement('p');
        const articleAmountEl = document.createElement('p');
        const articlePriceEl = document.createElement('p');
        const articleLabelEl = document.createElement('label');
        const articleCheckboxEl = document.createElement('input');

        articleContainerEl.classList.add('card__article__container');
        articleTitleEl.classList.add('card__article__title');
        articleBrandEl.classList.add('card__article__brand');
        articleWeightEl.classList.add('card__article__weight');
        articleAmountEl.classList.add('card__article__amount');
        articleAmountEl.setAttribute('data-amount', `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`);
        articlePriceEl.classList.add('card__article__price');
        articlePriceEl.setAttribute('data-price', `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`);

        articleLabelEl.classList.add('visually-hidden');
        articleLabelEl.for = `${object.ingredients[i].product}`;
        articleCheckboxEl.classList.add('card__article__checkbox');
        articleCheckboxEl.type = 'checkbox';
        articleCheckboxEl.id = `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`;

        const articleTitle = document.createTextNode(object.ingredients[i].product);
        const articleBrand = document.createTextNode(object.ingredients[i].brand);
        const articleWeight = document.createTextNode(object.ingredients[i].quantity);
        const articleAmount = document.createTextNode(object.ingredients[i].items);
        const articlePrice = document.createTextNode(`${object.ingredients[i].price} €`);
        const articleLabel = document.createTextNode(`${object.ingredients[i].product}`);

        articleTitleEl.appendChild(articleTitle);
        articleBrandEl.appendChild(articleBrand);
        articleWeightEl.appendChild(articleWeight);
        articleAmountEl.appendChild(articleAmount);
        articlePriceEl.appendChild(articlePrice);
        articleLabelEl.appendChild(articleLabel);

        articleContainerEl.appendChild(articleTitleEl);
        articleContainerEl.appendChild(articleBrandEl);
        articleContainerEl.appendChild(articleWeightEl);
        articleContainerEl.appendChild(articleAmountEl);
        articleContainerEl.appendChild(articlePriceEl);
        articleContainerEl.appendChild(articleLabelEl);
        articleContainerEl.appendChild(articleCheckboxEl);

        cardArticleListEl.appendChild(articleContainerEl);
    }

    recipeCheckboxes = document.querySelectorAll('.card__article__checkbox');
    recipeCheckboxes.forEach(recipeCheckbox => recipeCheckbox.addEventListener('click', handleRecipeCheckbox));
}

fetch(rissotoRecipeURL)
    .then(res => res.json())
    .then(data => createRecipeCard(data.recipe))