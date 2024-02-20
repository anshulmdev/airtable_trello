
import { globalConfig } from '@airtable/blocks';
import { reduceCredits } from "./globalConfig";
import secrets from "../secrets.json";



const trelloPost = async (cardsData, board, list, setProgress) => {
    const key = secrets.TRELLO_API_KEY;
    const token = globalConfig.get("trelloToken");
    const url = `https://api.trello.com/1/cards?idList=${list}&key=${key}&token=${token}`;
    setProgress(0.8);

    await Promise.all(cardsData.map(async (element) => { 
        await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(element)});
      }))

    setProgress(1.0);
    return true
}


export const writeToTrello = async (cardsData, setProgress, credits, board, list) => {
        await setProgress(0.3);
        const creditReduction = await reduceCredits(credits, setProgress);
        await setProgress(0.7);
        if (creditReduction) await trelloPost(cardsData, board, list, setProgress);
        else throw new error(creditReduction);
        await setProgress(0.0)
        return true;
   
}