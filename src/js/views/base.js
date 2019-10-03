export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
    shoppingTrash: document.querySelector('.remove-shopping-icon')
};

export const elementString = {
  loader: "loader"
};

export const renderLoader = parentEl => {
  const loader = `
        <div class="${elementString.loader}">
        <i class="fas fa-circle-notch"></i>
        </div>
    `;
  parentEl.insertAdjacentHTML("afterBegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementString.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
}
