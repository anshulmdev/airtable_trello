import { base, globalConfig } from '@airtable/blocks';
import secrets from "../secrets.json";

const trelloToken = globalConfig.get("trelloToken");

const fetchTrelloData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Trello API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Trello data:', error);
    throw error;
  }
};

export const getBoardList = async () => {
  const url = `https://api.trello.com/1/members/me/boards?key=${secrets.TRELLO_API_KEY}&token=${trelloToken}`;
  const response = await fetchTrelloData(url);
  return response.map(element => ({ value: element.id, label: element.name }));
};

export const getLists = async (boardId) => {
  const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${secrets.TRELLO_API_KEY}&token=${trelloToken}`;
  const response = await fetchTrelloData(url);
  return response.map(element => ({ value: element.id, label: element.name }));
};

export const fields = async (view) => {
  const queryResult = view.selectRecords();
  await queryResult.loadDataAsync();
  const viewMetadata = view.selectMetadata();
  await viewMetadata.loadDataAsync();
  const fields = viewMetadata.visibleFields;
  const rows = queryResult.records.length;
  const options = {
    titleOptions: [],
    descriptionOptions: [],
    dateOptions: [],
    labels: [],
    attachments: [],
  };

  fields.forEach((e) => {
    const record = { value: e.id, label: e.name };
    if (e.type === "singleLineText" || e.type === "multilineText") {
      options.titleOptions.push(record);
      options.descriptionOptions.push(record);
    }
    if (e.type === "multipleSelects") options.labels.push(record);
    if (e.type === "date") options.dateOptions.push(record);
    if (e.type === "multipleAttachments") options.attachments.push(record);
  });

  return { ...options, rows };
};