import {writeToTrello} from "./trelloCards"


export const createCards = async (view, setProgress, credits, setErrorDialogOpen, board, list, title, desc, startDate, endDate, label, attachment) => {
    await setProgress(0.1);
    try {
        const queryResult = view.selectRecords();
        await queryResult.loadDataAsync();
        const viewMetadata = view.selectMetadata();
        await viewMetadata.loadDataAsync();
        const tableRecords = queryResult;
        let records = [];
        const cardsData = [];
        tableRecords.records.forEach(element => {
            records.push(element._data.cellValuesByFieldId)
        });
        records.forEach((e) => {
            const card = {};
            if (e[title]) card["name"] = e[title];
            if (e[desc]) card["desc"] = e[desc];
            if (e[startDate]) card ["start"] = e[startDate];
            if (e[endDate]) card["due"] = e[endDate]
            if (e[attachment]) card["attachment"] = e[attachment];
            if (e[label]) card["label"] = e[label];
            cardsData.push(card)
        })

        await writeToTrello(cardsData, setProgress, credits, board, list);
        return true;

    } catch (error) {
        try {
            await setProgress(0.0);
            await setErrorDialogOpen(error.message);
        } catch(errorMessage_2) {
            console.log(errorMessage_2.message)
            await setErrorDialogOpen("Looks like we are offline or facing server issue. Please reload and try again!!!");

        }
        return;
    }
}