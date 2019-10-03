import axios from "axios";
import {key, key1, key2, key3, key4, key5, key6} from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `https://www.food2fork.com/api/get?key=${key6}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert("Something went wrong with this recipe :(");
    }
  }
  calcTime() {
    //assuming we need 15 min per ingredient
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map(el => {
      // 1) lowercase and remove parenthesis
      let ingredient = el.toLowerCase();
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // 2) Standard Units
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });

      // 3) ingredients in count, unit and ingredient
      const ingredientArr = ingredient.split(" ");

      let unitIndex;
      unitIndex = ingredientArr.findIndex(el2 => units.includes(el2));
      let ingredientObj;
      if (unitIndex > -1) {
        // there is a unit

        const arrCount = ingredientArr.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(ingredientArr[0].replace("-", "+"));
        } else {
          count = eval(ingredientArr.slice(0, unitIndex).join("+"));
        }
        ingredientObj = {
          count,
          unit: ingredientArr[unitIndex],
          ingredient: ingredientArr.slice(unitIndex + 1).join(" ")
        };
      } else if (unitIndex === -1) {
        // there is no unit
        ingredientObj = {
          count: 1,
          unit: "",
          ingredient // = ingredient: ingredient
        };
      } else if (parseInt(ingredientArr[0], 10)) {
        // there is no unit but 1st element is a number
        ingredientObj = {
          count: parseInt(ingredientArr[0], 10),
          unit: "",
          ingredient: ingredientArr.slice(1).join(" ") // = entire array - first element
        };
      }
      return ingredientObj;
    });
    this.ingredients = newIngredients;
  }
  updateServings(type){
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings);
    });
    this.servings = newServings;
  }
}
