import { elements } from './base';

export const renderItem = item => {
    const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
                    <div class="shopping__count">
                        <input type="number" min="0" value="${item.count}" step="${item.count}"  class="shopping__count-value">
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </li>
               
    `
    elements.shopping.insertAdjacentHTML('beforeend', markup);

}

export const shoppingTrash = numItems => {
    elements.shoppingTrash.style.display = numItems > 0 ? 'inline-block' : 'none';
};

export const clearList = () => {
    document.querySelector('.shopping__list').innerHTML = '';
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) {
        item.parentElement.removeChild(item);
    }
}