'use strict';

const rissotoRecipeURL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';

const cardTitleEl = document.querySelector('.card__title');
const cardArticleListEl = document.querySelector('.card__article-list');
const rissotoRecipe = '';

function createRecipeCard(object) {

    const cardTitle = document.createTextNode(object.name);
    cardTitleEl.appendChild(cardTitle);
    console.log(object.ingredients, object.ingredients.length)

    for (let article of object.ingredients.length) {

        const articleContainerEl = document.createElement('div');
        const articleTitleEl = document.createElement('h3');
        const articleBrandEl = document.createElement('h4');
        const articleWeightEl = document.createElement('p');
        const articleAmountEl = document.createElement('p');
        const articlePriceEl = document.createElement('p');

        const articleTitle = document.createTextNode(article.product);
        const articleBrand = document.createTextNode(article.brand);
        const articleWeight = document.createTextNode(article.quantity);
        const articleAmount = document.createTextNode(article.items);
        const articlePrice = document.createTextNode(article.price);

        articleTitleEl.appendChild(articleTitle);
        articleBrandEl.appendChild(articleBrand);
        articleWeightEl.appendChild(articleWeight);
        articleAmountEl.appendChild(articleAmount);
        articlePriceEl.appendChild(articlePrice);

        articleContainerEl.appendChild(articleTitleEl);
        articleContainerEl.appendChild(articleBrandEl);
        articleContainerEl.appendChild(articleWeightEl);
        articleContainerEl.appendChild(articleAmountEl);
        articleContainerEl.appendChild(articlePriceEl);

        cardArticleListEl.appendChild(articleContainerEl);
    }
}

fetch(rissotoRecipeURL)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        createRecipeCard(data.recipe);
    })