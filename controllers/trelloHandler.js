import {writeToTrello} from "./trelloCards"


export const createCards = async (view, setProgress, credits, setErrorDialogOpen, board, list, title, desc, startDate, endDate, label, attachment, setSuccessDialog) => {
    await setProgress(0.01);
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
        await setProgress(0.02);
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
        await setProgress(0.03);

        await writeToTrello(cardsData, setProgress, credits, board, list);
        await setProgress(0.0);
        await setSuccessDialog(true)
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