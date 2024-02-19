import { base, globalConfig } from '@airtable/blocks';
import secrets from "../secrets.json";


const trelloToken = globalConfig.get("trelloToken");

export const getBoardList = async () => {
    const url = `https://api.trello.com/1/members/me/boards?key=${secrets.TRELLO_API_KEY}&token=${trelloToken}`;
    const trelloData = await fetch(url);
    const response = await trelloData.json();
    const filteredData = [];
    response.forEach(element => {
        filteredData.push({value: element.id, label: element.name})
    });
    return filteredData
}


export const getLists = async (boardId) => {
    const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${secrets.TRELLO_API_KEY}&token=${trelloToken}`;
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
    const viewMetadata = view.selectMetadata();
    await viewMetadata.loadDataAsync();
    const fields = viewMetadata.visibleFields;
    const titleOptions = [];
    const descriptionOptions = [];
    const dateOptions = [];
    const labels = [];
    const attachments = [];

    fields.forEach((e) => {
        const record = {value: e.id, label: e.name};
        if (["singleLineText", "singleSelect", "multilineText"].includes(e.type)) { titleOptions.push(record); descriptionOptions.push(record)};
        if (["singleSelect", "multipleSelects"].includes(e.type)) {labels.push(record)};
        if (["date"].includes(e.type)) {dateOptions.push(record)};
        if (["multipleAttachments"].includes(e.type)) {attachments.push(record)};
    })
    return {titleOptions, descriptionOptions, dateOptions, labels, attachments}


}