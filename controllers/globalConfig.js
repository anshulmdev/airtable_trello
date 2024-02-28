
import { base, globalConfig } from '@airtable/blocks';
import secrets from '../secrets.json';
const url = secrets.REACT_APP_FUNCTIONURL;

const getData = async (id) => {
    const data = {
        "operation": "read",
        "payload": {
            "TableName": "airtable-excel",
            "Key": { id }
        }
    }
    const request = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
    })
    let response;
    try {
        response = await request.json();
        return response
    } catch (error) {
        return error.message
    }

}

const createNewUser = async (id, name, email) => {
    let credits = 1000;
    await globalConfig.setAsync(id, {credits: userInfo.credits});
    const data = {
        "operation": "create",
        "payload": {
            "TableName": "airtable-excel",
            "Item" :{ id, name, email, credits}
        }
      }
      const request = await fetch(url, {
        method: "POST",
        mode: 'no-cors',
        body: JSON.stringify(data)
    })
    return request;
}



export const storeToken = async (token, setIsDialogOpen) => {
    const url = `https://api.trello.com/1/members/me/boards?key=${secrets.TRELLO_API_KEY}&token=${token}`;
    const trelloData = await fetch(url);
    if ( trelloData.status === 200 ) {
        const response = await trelloData.json();
        const storeToken = await globalConfig.setAsync("trelloToken", token);
        return storeToken;
    } else {
        await setIsDialogOpen(true)
        return false;
    }
}




export const setGlobalVariables = async () => {
    try {
        const collaborator = base.activeCollaborators[0];
        const { id, email, name } = collaborator;
    
    
        const userInfo = await getData(id);
        if (userInfo.id) await globalConfig.setAsync(id, {credits: userInfo.credits});
        else await createNewUser(id, name, email)
        const getInfo = await getData(id);
        return true;

    } catch(error) {
        console.log(error);
        return true;
    }
    
}


export const reduceCredits = async (creditsToReduce, setProgress) => {
        const collaborator = base.activeCollaborators[0];
        const { id } = collaborator;
        const userInfo = await getData(id);
        const { email, name, credits } = userInfo;
        let NewCredits = credits - creditsToReduce;
        await setProgress(0.1);
        if (creditsToReduce > 100) throw new Error("The application can only transfer up to 100 records at a time. Please use filters to reduce the number of records you're trying to transfer.")
        if (NewCredits < 0) throw new Error ("You don't have suffiecient credits for this operation. Please contact to upgrade")
        const data = {
            "operation": "create",
            "payload": {
                "TableName": "airtable-excel",
                "Item" :{ id, name, email, credits: NewCredits}
            }
          }
          const request = await fetch(url, {
            method: "POST",
            mode: 'no-cors',
            body: JSON.stringify(data)
        })
        await setProgress(0.15);
        await setGlobalVariables();
        await setProgress(0.20);
        return true;


}

export const refundCredits = async (creditsToAdd) => {
    const collaborator = base.activeCollaborators[0];
    const { id } = collaborator;
    const userInfo = await getData(id);
    const { email, name, credits } = userInfo;
    let NewCredits = credits + creditsToAdd;
    const data = {
        "operation": "create",
        "payload": {
            "TableName": "airtable-excel",
            "Item" :{ id, name, email, credits: NewCredits}
        }
      }
      const request = await fetch(url, {
        method: "POST",
        mode: 'no-cors',
        body: JSON.stringify(data)
    })
    await setGlobalVariables();
    return true;


}