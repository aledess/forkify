import uniqId from 'uniqid';

export default class List{
    constructor(){
        this.items = [];
    }
    addItem(count, unit, ingredient){
        const item = {
            id: uniqId(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        this.persistData()
        return item;

    }
    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
        this.persistData();

    }
    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
    persistData(){
        localStorage.setItem('list', JSON.stringify(this.items))
    }
    readStorage(){
        const storage = JSON.parse(localStorage.getItem('list'));
        if (storage) this.items = storage;
    }
    isItem(ingredient){
        return this.items.findIndex(el => el.ingredient === ingredient) !== -1;
    }
    getNumItems(){
        return this.items.length;
    }
    deleteAllList(){
        this.items = [];
        this.persistData();
    }
   
}