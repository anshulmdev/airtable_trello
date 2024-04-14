import { globalConfig } from '@airtable/blocks';
import { reduceCredits } from "./globalConfig";
import secrets from "../secrets.json";

const key = secrets.TRELLO_API_KEY;
const token = globalConfig.get("trelloToken");

const fetchTrelloData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Trello API error: ${response.status} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Trello data:', error);
    throw error;
  }
};

const getLabelIds = async (board, airtableLabels) => {
  const labelUrl = `https://api.trello.com/1/boards/${board}/labels?key=${key}&token=${token}`;
  const labelDataRes = await fetchTrelloData(labelUrl);
  const boardLabels = labelDataRes.reduce((acc, label) => {
    acc[label.name] = label.id;
    return acc;
  }, {});

  const createLabel = async (name) => {
    const createLabelUrl = `https://api.trello.com/1/labels?name=${name}&color=blue&idBoard=${board}&key=${key}&token=${token}`;
    const labelResponse = await fetchTrelloData(createLabelUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    return labelResponse.id;
  };

  const finalLabelIDs = await Promise.all(airtableLabels.map(async (label) => {
    return boardLabels[label.name] || await createLabel(label.name);
  }));

  return finalLabelIDs;
};

const trelloPost = async (cardsData, board, list, setProgress, credits) => {
  const url = `https://api.trello.com/1/cards?idList=${list}&key=${key}&token=${token}`;
  await setProgress(0.3);
  let counter = 0.3;
  let rangeCounter = 0.6 / credits;

  for (let element of cardsData) {
    try {
      const body = { name: element.name, desc: element.desc, start: element.start, due: element.due };
      if (element.label) body["idLabels"] = await getLabelIds(board, element.label);
      const cardRes = await fetchTrelloData(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

      if (element.attachment) {
        const cardId = cardRes.id;
        const attachmentUrl = `https://api.trello.com/1/cards/${cardId}/attachments?key=${key}&token=${token}`;
        await Promise.all(element.attachment.map(async (file) => {
          const attachmentBody = { name: file.filename, url: file.url };
          await fetchTrelloData(attachmentUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(attachmentBody) });
        }));
      }

      counter += rangeCounter;
      await setProgress(counter);
    } catch (error) {
      console.error('Error creating Trello card:', error);
      throw error;
    }
  }

  await setProgress(0.9);
  return true;
};

export const writeToTrello = async (cardsData, setProgress, credits, board, list) => {
  try {
    await setProgress(0.08);
    await reduceCredits(credits, setProgress);
    await setProgress(0.25);
    await trelloPost(cardsData, board, list, setProgress, credits);
    await setProgress(0.0);
    return true;
  } catch (error) {
    console.error('Error writing to Trello:', error);
    throw error;
  }
};