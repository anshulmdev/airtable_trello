import { writeToTrello } from "./trelloCards";

export const createCards = async (view, setProgress, credits, setErrorDialogOpen, board, list, title, desc, startDate, endDate, label, attachment, setSuccessDialog) => {
  try {
    await setProgress(0.01);

    if (!board || !list || !title) {
      throw new Error("Please recheck! Some fields are missing.");
    }

    const queryResult = view.selectRecords();
    await queryResult.loadDataAsync();
    const viewMetadata = view.selectMetadata();
    await viewMetadata.loadDataAsync();
    const records = queryResult.records.map(record => record._data.cellValuesByFieldId);

    await setProgress(0.02);

    const cardsData = records.map((record) => ({
      name: record[title],
      desc: record[desc],
      start: record[startDate],
      due: record[endDate],
      attachment: record[attachment],
      label: record[label],
    }));

    await setProgress(0.03);

    await writeToTrello(cardsData, setProgress, credits, board, list);
    await setProgress(0.0);
    await setSuccessDialog(true);
    return true;
  } catch (error) {
    console.error('Error creating cards:', error);
    await setProgress(0.0);
    await setErrorDialogOpen(error.message);
    return false;
  }
};