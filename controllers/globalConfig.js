import { base, globalConfig } from '@airtable/blocks';
import secrets from '../secrets.json';
const url = secrets.REACT_APP_FUNCTIONURL;

export const reconnect = async () => {
  await globalConfig.setAsync('trelloToken', null);
  await location.reload();
  return true;
};

export const ValidateToken = async () => {
  try {
    const token = await globalConfig.get('trelloToken');

    if (!token) {
      return false;
    }

    const url = `https://api.trello.com/1/members/me?key=${secrets.TRELLO_API_KEY}&token=${token}`;
    const response = await fetch(url);

    if (response.ok) {
      return true;
    }

    await globalConfig.setAsync('trelloToken', null);
    return false;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

const fetchData = async (data) => {
  try {
    const request = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const response = await request.json();
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const storeToken = async (token, setIsDialogOpen, setSuccessDialog) => {
  try {
    const url = `https://api.trello.com/1/members/me/boards?key=${secrets.TRELLO_API_KEY}&token=${token}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Trello API error: ${response.status} - ${errorText}`);
    }
    await response.json();
    await globalConfig.setAsync("trelloToken", token);
    await setSuccessDialog(true);
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    await setIsDialogOpen(true);
    return false;
  }
};

export const setGlobalVariables = async () => {
  try {
    const collaborator = base.activeCollaborators[0];
    const { id, email, name } = collaborator;

    const data = {
      operation: "read",
      payload: {
        TableName: "airtable-excel",
        Key: { id },
      },
    };
    const userInfo = await fetchData(data);

    if (userInfo) {
      await globalConfig.setAsync(id, { credits: userInfo.credits });
    } else {
      const createData = {
        operation: "create",
        payload: {
          TableName: "airtable-excel",
          Item: { id, name, email, credits: 1000 },
        },
      };
      await fetchData(createData);
      await globalConfig.setAsync(id, { credits: 1000 });
    }
    return true;
  } catch (error) {
    console.error('Error setting global variables:', error);
    return false;
  }
};

export const reduceCredits = async (creditsToReduce, setProgress) => {
  try {
    const collaborator = base.activeCollaborators[0];
    const { id } = collaborator;
    const data = {
      operation: "read",
      payload: {
        TableName: "airtable-excel",
        Key: { id },
      },
    };
    const userInfo = await fetchData(data);
    const { email, name, credits } = userInfo;
    let NewCredits = credits - creditsToReduce;
    await setProgress(0.1);

    if (creditsToReduce > 100) {
      throw new Error("The application can only transfer up to 100 records at a time. Please use filters to reduce the number of records you're trying to transfer.");
    }
    if (NewCredits < 0) {
      throw new Error("You don't have sufficient credits for this operation. Please contact to upgrade.");
    }

    const updateData = {
      operation: "create",
      payload: {
        TableName: "airtable-excel",
        Item: { id, name, email, credits: NewCredits },
      },
    };
    await fetchData(updateData);
    await setProgress(0.15);
    await setGlobalVariables();
    await setProgress(0.2);
    return true;
  } catch (error) {
    console.error('Error reducing credits:', error);
    throw error;
  }
};

export const refundCredits = async (creditsToAdd) => {
  try {
    const collaborator = base.activeCollaborators[0];
    const { id } = collaborator;
    const data = {
      operation: "read",
      payload: {
        TableName: "airtable-excel",
        Key: { id },
      },
    };
    const userInfo = await fetchData(data);
    const { email, name, credits } = userInfo;
    let NewCredits = credits + creditsToAdd;

    const updateData = {
      operation: "create",
      payload: {
        TableName: "airtable-excel",
        Item: { id, name, email, credits: NewCredits },
      },
    };
    await fetchData(updateData);
    await setGlobalVariables();
    return true;
  } catch (error) {
    console.error('Error refunding credits:', error);
    throw error;
  }
};