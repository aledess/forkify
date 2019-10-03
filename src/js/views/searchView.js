import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => (elements.searchInput.value = "");

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
  const resultsArr= document.querySelectorAll('.results__link');
  resultsArr.forEach(item => {
    item.classList.remove('results__link--active');
  });
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active')
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>        
    </button>
    `;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    button = createButton(page, 'next');
  } else if (page < pages) {
    button = `${createButton(page, 'prev')} ${createButton(page, 'next')}`;
  } else if (page === pages && pages > 1) {
    button = createButton(page, 'prev');
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const limitRecipeTitle = (title, limit = 16) => {
  return title.length > limit ? `${title.slice(0, limit)} ...` : title;
};

const AlternativelimitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    //  return the result
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markup = `
      <li>
      <a class="results__link list__link" href="#${recipe.recipe_id}">
          <figure class="results__fig list__fig">
              <img src="${recipe.image_url}" alt="Test">
          </figure>
          <div class="results__data list__data">
              <h4 class="results__name list__name">${limitRecipeTitle(
                recipe.title
              )}</h4>
              <p class="results__author list__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>
      `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Render in base of page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  // Render page buttons
  renderButtons(page, recipes.length, resPerPage);
};
