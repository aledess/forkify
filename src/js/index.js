import "../sass/main.scss";

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";

import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";

import { elements, renderLoader, clearLoader } from "./views/base";

const state = {};
/*****************************************************************/
/************************ SEARCH CONTROL *************************/
/*****************************************************************/
const controlSearch = async () => {
  // 1 )Get query from view
  const query = searchView.getInput();
  // 2) Create new Search object and add it in state var
  state.search = new Search(query);
  // 3) Prepare UI to get results
  searchView.clearInput();
  searchView.clearResults();
  renderLoader(elements.searchRes);
  try {
    // 4) Search for recipes
    await state.search.getResults();
    // 5) Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  } catch (error) {
    alert("Something wrong with Search");
    clearLoader();
  }
};
/*****************************************************************/
/************************ RECIPE CONTROL *************************/
/*****************************************************************/
const controlRecipe = async () => {
  // Get id from url
  const id = window.location.hash.replace("#", "");
  if (id) {
    // prepare UI
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    if (state.search) searchView.highlightSelected(id);
    // Create new Recipe obj
    state.recipe = new Recipe(id);
    try {
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();

      clearLoader();
      //dispay recipe
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert("Error loading recipe");
    }
  }
};
/*****************************************************************/
/******************** LIST (shopping) CONTROL ********************/
/*****************************************************************/
const controlList = () => {
  if (!state.list) state.list = new List();
  state.recipe.ingredients.forEach(el => {
    if (!state.list.isItem(el.ingredient)) {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      console.log(item);
      listView.renderItem(item);
    }
  });
  listView.shoppingTrash(state.list.getNumItems());
};
/*****************************************************************/
/************************** LIKES CONTROL ************************/
/*****************************************************************/
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  //user ha not yet liked recipe
  if (!state.likes.isLiked(currentId)) {
    //add like to state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // toggle the like button
    likesView.toggleLikeBtn(true);

    // add like to ui
    likesView.renderLike(newLike);

    // user has liked current recipe
  } else {
    //remove like to state
    state.likes.deleteLike(currentId);
    // toggle the like button
    likesView.toggleLikeBtn(false);

    // remove like to ui
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};
/*****************************************************************/
/************************ EVENT LISTENERS ************************/
/*****************************************************************/
/////////////////////// SEARCH SUBMIT ////////////////////////////
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});
////////////////// RELOAD AND CHANGE RECIPE //////////////////////
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
// PAGINATION BUTTONS
elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});
//////////////////////////  RECIPE ///////////////////////////////
// INCREASE/DECREASE SERVINGS
// ADD SHOPPING LIST
// ADD LIKES
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  } else if (e.target.matches(".recipe-item-add")) {
    const li = e.target.closest('.recipe__item')
    // const ing = document.querySelector('.recipe__ingredients li .recipe__count').innerHTML;
    const count = li.children[1].innerHTML;
    const unit = li.children[2].firstElementChild.innerHTML;
    let ing = li.children[2].innerHTML;
    ing  = ing.slice(ing.indexOf('</span>')+7)

    if (!state.list.isItem(ing)) {
    const item = state.list.addItem(count, unit, ing);
    console.log(item);
    listView.renderItem(item);
  listView.shoppingTrash(state.list.getNumItems());

    }

  

    
  
  }

});
//////////////////////////  SHOPPING  /////////////////////////////
elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
    listView.shoppingTrash(state.list.getNumItems());
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

elements.shoppingTrash.addEventListener("click", () => {
  listView.clearList();
  state.list.deleteAllList();
  listView.shoppingTrash(state.list.getNumItems());
});

window.addEventListener("load", () => {
  state.likes = new Likes();
  state.list = new List();
  state.likes.readStorage();
  state.list.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  listView.shoppingTrash(state.list.getNumItems());
  state.likes.likes.forEach(like => likesView.renderLike(like));
  state.list.items.forEach(item => listView.renderItem(item));

  console.log(state);
});
