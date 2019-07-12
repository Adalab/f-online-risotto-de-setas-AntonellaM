'use strict';

const rissotoRecipeURL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';

const cardTitleEl = document.querySelector('.card__title');
const cardArticleListEl = document.querySelector('ul.container-fluid');
let recipeCheckboxes = [];
const totalItemsEl = document.querySelector('.card__items--total');
const subtotalPriceEl = document.querySelector('.card__subtotal--total');
const totalPriceEl = document.querySelector('.card__total--total');
const shippingPriceEl = document.querySelector('.card__shipping-cost--total');
const buttonPriceEl = document.querySelector('.card__total-price');
let totalItems = 0;
let totalPrice = 0;
const shippingPrice = 7;
setPurchaseValues();

function setPurchaseValues() {
    totalItemsEl.innerHTML = totalItems;
    subtotalPriceEl.innerHTML = `${totalPrice.toFixed(2)} €`;
    shippingPriceEl.innerHTML = `${shippingPrice.toFixed(2)} €`;
    totalPriceEl.innerHTML = totalItems !== 0 ? `${(totalPrice + shippingPrice).toFixed(2)} €` : `${totalPrice.toFixed(2)} €`;
    buttonPriceEl.innerHTML = totalPriceEl.innerHTML;
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

function addClasses(newElement, classes) {
    for (let i = 0; i < classes.length; i++) {
        newElement.classList.add(classes[i]);
    }
}

function addText(newElement, text) {
    const newText = document.createTextNode(text);
    newElement.appendChild(newText);
}

function addAttributes(newElement, attributes) {
    console.log('fx', attributes, attributes[1][name], attributes[1].name)
    for (let i = 0; i < attributes.length; i++) {
        newElement.setAttribute(attributes[i][name], attributes[i].name);
    }
}

function createElement(element, classes, text, attributes) {
    const newElement = document.createElement(element);
    console.log(attributes)
    classes && addClasses(newElement, classes);
    text && addText(newElement, text);
    attributes && addAttributes(newElement, attributes)

    return newElement;
}

function appendChildren(element, children) {
    for (let i = 0; i < children.length; i++) {
        element.appendChild(children[i]);
    }
}

function createRecipeCard(object) {

    const cardTitle = document.createTextNode(object.name);
    cardTitleEl.appendChild(cardTitle);

    for (let i = 0; i < object.ingredients.length; i++) {

        const articleContainerEl = createElement('li', ['row', 'card__article__container']);

        //Checkbox

        const articleCheckboxContainerEl = createElement('div', ['d-flex', 'justify-content-center', 'align-items-center', 'col-1']);
        const articleCheckboxEl = createElement('input', ['card__article__checkbox'], null, [{'type': 'checkbox'}, {'id': `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`}]);
        // articleCheckboxEl.type = 'checkbox';
        // articleCheckboxEl.id = `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`;
        articleCheckboxContainerEl.appendChild(articleCheckboxEl);

        //Amount

        const articleAmountContainerEl = createElement('div', ['d-flex', 'justify-content-center', 'align-items-center', 'col-2']);
        const articleAmountEl = createElement('p', ['card__article__amount', 'd-flex', 'justify-content-center', 'align-items-center'], object.ingredients[i].items, [{'data-amount': `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`}]); 
        articleAmountContainerEl.appendChild(articleAmountEl);

        //Data
        const articleDataContainerEl = createElement('div', ['col-7']);
        const articleTitleEl = createElement('h3', ['card__article__title'], object.ingredients[i].product);
        const articleBrandEl = createElement('h4', ['card__article__brand'], object.ingredients[i].brand);
        const articleWeightEl = createElement('p', ['card__article__weight'], object.ingredients[i].quantity);
        appendChildren(articleDataContainerEl, [articleTitleEl, articleBrandEl, articleWeightEl]);
        
        //Price
        const articlePriceEl = createElement('p', ['card__article__price', 'col-2'], `${object.ingredients[i].price} €`, [{'data-price': `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`}]);


        appendChildren(articleContainerEl, [articleCheckboxContainerEl, articleAmountContainerEl, articleDataContainerEl, articlePriceEl])

        cardArticleListEl.appendChild(articleContainerEl);
    }

    recipeCheckboxes = document.querySelectorAll('.card__article__checkbox');
    recipeCheckboxes.forEach(recipeCheckbox => recipeCheckbox.addEventListener('click', handleRecipeCheckbox));
}

fetch(rissotoRecipeURL)
    .then(res => res.json())
    .then(data => createRecipeCard(data.recipe))