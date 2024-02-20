
import { globalConfig } from '@airtable/blocks';
import { reduceCredits } from "./globalConfig";
import secrets from "../secrets.json";

const key = secrets.TRELLO_API_KEY;
const token = globalConfig.get("trelloToken");


const getLabelIds = async (board, airtableLabels) => {
  const labelUrl = `https://api.trello.com/1/boards/${board}/labels?key=${key}&token=${token}`
  const labelDataReq = await fetch(labelUrl);
  const labelDataRes = await labelDataReq.json();
  const boardLabels = {};
  labelDataRes.map((e) => boardLabels[e.name] = e.id);
  const createLabel = async (name) => {
    const createLabelUrl = `https://api.trello.com/1/labels?name=${name}&color=blue&idBoard=${board}&key=${key}&token=${token}`
    const createLabel = await fetch(createLabelUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }})
    const labelResponse = await createLabel.json();
    return labelResponse.id;
  }
  const finalLabelIDs = []
  for (let element of airtableLabels){
    if (boardLabels[element.name]) {
      finalLabelIDs.push(boardLabels[element.name])
    } else {
      finalLabelIDs.push(await createLabel(element.name))
    }
  };
  return finalLabelIDs

}

const trelloPost = async (cardsData, board, list, setProgress, credits) => {
  const url = `https://api.trello.com/1/cards?idList=${list}&key=${key}&token=${token}`;
  await setProgress(0.30);
  let counter = 0.3;
  let rangeCounter = 0.6/credits;

  for (let element of cardsData ) {
    const body = { name: element.name, desc: element.desc, start: element.start, due: element.due};
    if (element.label) body["idLabels"] = await getLabelIds(board, element.label);
    const cardReq = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const cardRes = await cardReq.json();
    if (element.attachment) {
      const cardId = cardRes.id;
      const attachmentUrl = `https://api.trello.com/1/cards/${cardId}/attachments?key=${key}&token=${token}`
      for (let file of element.attachment) {
        const attachmentBody = { name: file.filename, url: file.url }
        const attachmentReq = await fetch(attachmentUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(attachmentBody) });
      }
    }
    counter = counter + rangeCounter;
    await setProgress(counter);
  }

  await setProgress(0.9);
  return true
}


export const writeToTrello = async (cardsData, setProgress, credits, board, list) => {
  await setProgress(0.08);
  const creditReduction = await reduceCredits(credits, setProgress);
  await setProgress(0.25);
  if (creditReduction) await trelloPost(cardsData, board, list, setProgress, credits);
  else throw new error(creditReduction);
  await setProgress(0.0)
  return true;

}