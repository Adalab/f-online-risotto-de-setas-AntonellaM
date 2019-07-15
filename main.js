'use strict';

const rissotoRecipeURL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';

const cardTitleEl = document.querySelector('.card__title');
const cardArticleListEl = document.querySelector('ul.container-fluid');
const totalItemsEl = document.querySelector('.card__items--total');
const subtotalPriceEl = document.querySelector('.card__subtotal--total');
const totalPriceEl = document.querySelector('.card__total--total');
const shippingPriceEl = document.querySelector('.card__shipping-cost--total');
const buttonPriceEl = document.querySelector('.card__total-price');
const buttonSelectEl = document.querySelector('.card__button--select');
const buttonUnselectEl = document.querySelector('.card__button--unselect');

let recipeCheckboxes = [];
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

function selectAllItems() {
    const allItemsPrices = document.querySelectorAll('.card__article__price');
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    console.log(allItemsPrices, allCheckboxes)
    allCheckboxes.forEach(checkbox => checkbox.checked = true);
    allItemsPrices.forEach(item => {
        totalItems += 1;
        totalPrice += parseFloat(item.innerHTML.replace(new RegExp(' €', 'g'), ''));
        setPurchaseValues()
    })
}

function resetShoppingList() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => checkbox.checked = false);

    totalItems = 0;
    totalPrice = 0;
    setPurchaseValues();
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

function createElement(element, classes, text) {
    const newElement = document.createElement(element);
    classes && addClasses(newElement, classes);
    text && addText(newElement, text);

    return newElement;
}

function appendChildren(element, children) {
    for (let i = 0; i < children.length; i++) {
        element.appendChild(children[i]);
    }
}

function addEventListeners(elements, action, handler) {
    elements.forEach(element => element.addEventListener(action, handler));
}

function createRecipeCard(object) {

    const cardTitle = document.createTextNode(object.name);
    cardTitleEl.appendChild(cardTitle);

    for (let i = 0; i < object.ingredients.length; i++) {

        const articleContainerEl = createElement('li', ['row', 'card__article__container']);

        //Checkbox

        const articleCheckboxContainerEl = createElement('div', ['d-flex', 'justify-content-center', 'align-items-center', 'col-1']);
        const articleCheckboxEl = createElement('input', ['card__article__checkbox']);
        articleCheckboxEl.type = 'checkbox';
        articleCheckboxEl.id = `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`;
        articleCheckboxContainerEl.appendChild(articleCheckboxEl);

        //Amount

        const articleAmountContainerEl = createElement('div', ['d-flex', 'justify-content-center', 'align-items-center', 'col-2']);
        const articleAmountEl = createElement('p', ['card__article__amount', 'd-flex', 'justify-content-center', 'align-items-center'], object.ingredients[i].items);
        articleAmountEl.setAttribute('data-amount', `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`);
        articleAmountContainerEl.appendChild(articleAmountEl);

        //Data
        const articleDataContainerEl = createElement('div', ['col-7']);
        const articleTitleEl = createElement('h3', ['card__article__title'], object.ingredients[i].product);
        const articleBrandEl = createElement('h4', ['card__article__brand'], object.ingredients[i].brand);
        const articleWeightEl = createElement('p', ['card__article__weight'], object.ingredients[i].quantity);
        appendChildren(articleDataContainerEl, [articleTitleEl, articleBrandEl, articleWeightEl]);
        
        //Price
        const articlePriceEl = createElement('p', ['card__article__price', 'col-2'], `${object.ingredients[i].price} €`);
        articlePriceEl.setAttribute('data-price', `${object.ingredients[i].product.replace(new RegExp(' ', 'g'), '_').replace(new RegExp(',', 'g'), '_').toLowerCase()}`);


        appendChildren(articleContainerEl, [articleCheckboxContainerEl, articleAmountContainerEl, articleDataContainerEl, articlePriceEl])

        cardArticleListEl.appendChild(articleContainerEl);
    }

    recipeCheckboxes = document.querySelectorAll('.card__article__checkbox');
    addEventListeners(recipeCheckboxes, 'click', handleRecipeCheckbox);
}

fetch(rissotoRecipeURL)
    .then(res => res.json())
    .then(data => createRecipeCard(data.recipe))

buttonSelectEl.addEventListener('click', selectAllItems);
buttonUnselectEl.addEventListener('click', resetShoppingList);