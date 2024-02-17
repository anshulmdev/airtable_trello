import { globalConfig } from '@airtable/blocks';
import secrets from "../secrets.json";


const trelloToken = globalConfig.get("trelloToken");

export const getBoardList = async () => {
    const url = `https://api.trello.com/1/members/me/boards?key=${secrets.TRELLO_API_KEY}&token=${secrets.TRELLO_TOKEN}`;
    const trelloData = await fetch(url);
    const response = await trelloData.json();
    const filteredData = [];
    response.forEach(element => {
        filteredData.push({value: element.id, label: element.name})
    });
    return filteredData
}


export const getLists = async (boardId) => {
    const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${secrets.TRELLO_API_KEY}&token=${secrets.TRELLO_TOKEN}`;
    const trelloData = await fetch(url);
    const response = await trelloData.json();
    const filteredData = [];
    response.forEach(element => {
        filteredData.push({value: element.id, label: element.name})
    });
    console.log(filteredData)
    return filteredData
}

export const fields = async (view) => {

}