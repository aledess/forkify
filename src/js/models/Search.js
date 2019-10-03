import axios from 'axios';
import {key, key1, key2, key3, key4, key5, key6} from '../config';



// Creo la classe search che data una query in input col metodo
// getResults fa la chiamata al server e restituisce un risultato
export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults(){
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key6}&q=${this.query}`);
            this.result = res.data.recipes;
        }
        catch(error){
            alert('error');
        }
    }
}