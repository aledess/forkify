import { elements } from './base';
import { limitRecipeTitle } from './searchView';
{/* <i class="far fa-heart header-likes"></i> */}
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'fas' : 'far';
    document.querySelector('.recipe__love i').classList.remove('fas');
    document.querySelector('.recipe__love i').classList.remove('far');
    document.querySelector('.recipe__love i').classList.add(iconString);

}

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
  const markup = `<li>
    <a class="likes__link list__link" href="#${like.id}">
        <figure class="likes__fig list__fig">
            <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data list__data">
            <h4 class="likes__name list__name">${limitRecipeTitle(like.title)}</h4>
            <p class="likes__author list__author">${like.author}</p>
        </div>
    </a>
</li>`;
  elements.likesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}
