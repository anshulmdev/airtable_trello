import React, { useState, useEffect } from "react";
import { base, globalConfig } from '@airtable/blocks';
import { Tooltip, Text, Icon, Box, Select, TablePicker, ViewPicker, Button, Dialog, Heading, ProgressBar} from "@airtable/blocks/ui";
import secrets from "../secrets.json";
import { createCards } from "../controllers/trelloHandler";
import { getBoardList, getLists, fields } from "../controllers/formFields"


export const MainView = () => {
    const collaborator = base.activeCollaborators[0];
    const { id } = collaborator;
    const user = globalConfig.get(id);
    const sample = {value:1, label: "sample"};
    const [progress, setProgress] = useState(0.0);
    const [ErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [table, setTable] = useState(base.tables[0]);
    const [view, setView] = useState(table.views[0]);
    globalConfig.setAsync("table", table.id);
    globalConfig.setAsync("view", view.id);
    const [boardOptions, setBoardOptions] = useState([sample]);
    const [listOptions, setListOptions] = useState([sample]);
    const [board, setBoard] = useState(sample.value);
    const [list, setList] = useState(sample.value);
    const [fieldOptions, setFieldOptions] = useState({ titleOptions: [sample], descriptionOptions: [sample], dateOptions: [sample], labels: [sample], attachments: [sample] });
    const [title, setTitle] = useState(sample.value);
    const [desc, setDesc] = useState(sample.value);
    const [startDate, setStartDate] = useState(sample.value);
    const [endDate, setEndDate] = useState(sample.value);
    const [label, setLabel] = useState(sample.value);
    const [attachment, setAttachment] = useState(sample.value);
    const [rows, setRows] = useState(0);

    const setRecord = async (update, value) => {
        if (update === "table") {
            await setTable(value);
            await setView(value.views[0]);
            await globalConfig.setAsync("view", value.views[0].id)
            await getFields(value.views[0]);
        }
        if (update === "view") {
            await setView(value);
            await globalConfig.setAsync("view", value.id)
            await getFields(value);
        }
        return true
    }
    const getFields = async (view) => {
        const fieldOptions = await fields(view);
        const { titleOptions, descriptionOptions, dateOptions, labels, attachments, rows } = fieldOptions;
        setRows(rows);
        setFieldOptions(fieldOptions);
        if (titleOptions.length) setTitle(titleOptions[0].value);
        if (descriptionOptions.length) setDesc(descriptionOptions[0].value);
        if (dateOptions.length) setStartDate(dateOptions[0].value);
        if (dateOptions.length) setEndDate(dateOptions[0].value);
        if (labels.length) setLabel(labels[0].value);
        if (attachments.length) setAttachment(attachments[0].value);
        return true;
    }

    useEffect(() => {
        const getBoards = async () => {
            const boardList = await getBoardList();
            const lists = await getLists(boardList[0].value);
            setBoardOptions(boardList);
            setBoard(boardList[0].value);
            setListOptions(lists);
            setList(lists[0].value);
            return true
        }

        getBoards();
        getFields(view);

    }, [])


    return (
        <div>
            <Box style={{ "borderColor": secrets.REACT_THEME_DARK_COLOR, borderRadius: 5 }} border="default">
                <Box marginTop={2} display="flex" justifyContent="flex-end" alignIt2ms="right">
                    <Text><b>{user ? user.credits : 0}: Credits</b></Text>
                    <Tooltip
                        content="Einfach Application Credits to use Einfach Apps"
                        placementX={Tooltip.placements.CENTER}
                        placementY={Tooltip.placements.BOTTOM}
                        shouldHideTooltipOnClick={true}
                    >
                        <Icon marginX={2} name="help" size={16} />

                    </Tooltip>
                </Box>

            <Box style={{ 'borderStyle': 'dashed', 'borderRadius': 1, 'borderWidth': 1 }} margin={2} paddingY={2}>
                <Box display="flex" alignItems="center" paddingX={3} paddingBottom={1} paddingTop={2}>
                    <Icon name="cube" size={16} />
                    <Text flex={1} paddingLeft={1} justifyContent='flex-start'><b>Airtable Configuration</b></Text>
                </Box>
                <Box paddingTop={3} display="flex">
                    <Text marginX={3} flex={1} justifyContent='flex-start'><b>Table</b></Text>
                    <Text marginX={3} flex={1} justifyContent='flex-end'><b>View</b></Text>
                </Box>
                <Box marginY={1} marginTop={2} display="flex">
                    <Text as={'p'} marginX={3} flex={1} justifyContent='flex-start'>Prepare excel as per selected table</Text>
                    <Text marginX={3} flex={1} justifyContent='flex-end'>Select filtered view for export</Text>
                </Box>
                <Box display="flex" paddingBottom={2}>
                    <TablePicker flex={1} justifyContent='flex-start' marginX={3}
                        table={table}
                        onChange={newTable => { setRecord("table", newTable) }}
                        width="320px"
                    />
                    <ViewPicker
                        flex={1} justifyContent='flex-start' marginX={3}
                        table={table}
                        view={view}
                        onChange={newView => { setRecord("view", newView) }}
                        width="320px"
                    />
                </Box>
            </Box>
            <Box style={{ 'borderStyle': 'dashed', 'borderRadius': 1, 'borderWidth': 1 }} margin={2} paddingY={2}>

                <Box display="flex" alignItems="center" paddingX={3} paddingBottom={3} paddingTop={2}>
                    <Icon name="form" size={14} />
                    <Text flex={1} paddingLeft={1} justifyContent='flex-start'><b>Trello Card Configuration</b></Text>
                </Box>
                <Box paddingBottom={3}>
                    <Box display="flex">
                        <Text marginX={3} flex={1} justifyContent='flex-start'><b>Trello Board</b></Text>
                        <Text marginX={3} flex={1} justifyContent='flex-end'><b>Trello List</b></Text>
                    </Box>
                    <Box marginY={1} marginTop={2} display="flex">
                        <Text as={'p'} marginX={3} flex={1} justifyContent='flex-start'>Board Destination</Text>
                        <Text marginX={3} flex={1} justifyContent='flex-end'>List Destination</Text>
                    </Box>
                    <Box display="flex">
                        <Select
                            flex={1} justifyContent='flex-start' marginX={3}
                            options={boardOptions}
                            value={board}
                            onChange={newValue => setBoard(newValue)}
                            width="320px"
                        />
                        <Select
                            flex={1} justifyContent='flex-start' marginX={3}
                            options={listOptions}
                            value={list}
                            onChange={newValue => setList(newValue)}
                            width="320px"
                        />
                    </Box>
                </Box>
                <Box paddingBottom={3}>
                    <Box display="flex">
                        <Text marginX={3} flex={1} justifyContent='flex-start'><b>Card Title</b></Text>
                        <Text marginX={3} flex={1} justifyContent='flex-end'><b>Card Description</b></Text>
                    </Box>
                    <Box marginY={1} marginTop={2} display="flex">
                        <Text as={'p'} marginX={3} flex={1} justifyContent='flex-start'>Board Destination</Text>
                        <Text marginX={3} flex={1} justifyContent='flex-end'>List Destination</Text>
                    </Box>
                    <Box display="flex">
                        <Select
                            flex={1} justifyContent='flex-start' marginX={3}
                            options={fieldOptions.titleOptions}
                            value={title}
                            onChange={newValue => setTitle(newValue)}
                            width="320px"
                        />
                        <Select
                            flex={1} justifyContent='flex-start' marginX={3}
                            options={fieldOptions.descriptionOptions}
                            value={desc}
                            onChange={newValue => setDesc(newValue)}
                            width="320px"
                        />
                    </Box>
                </Box>
                <Box paddingBottom={3}>
                    <Box display="flex">
                        <Text marginX={3} flex={1} justifyContent='flex-start'><b>Start Date</b></Text>
                        <Text marginX={3} flex={1} justifyContent='flex-end'><b>End Date</b></Text>
                    </Box>
                    <Box marginY={1} marginTop={2} display="flex">
                        <Text as={'p'} marginX={3} flex={1} justifyContent='flex-start'>Board Destination</Text>
                        <Text marginX={3} flex={1} justifyContent='flex-end'>List Destination</Text>
                    </Box>
                    <Box display="flex">
                        <Select
                            flex={1} justifyContent='flex-start' marginX={3}
                            options={fieldOptions.dateOptions}
                            value={startDate}
                            onChange={newValue => setStartDate(newValue)}
                            width="320px"
                        />
                        <Select
                            flex={1} justifyContent='flex-start' marginX={3}
                            options={fieldOptions.dateOptions}
                            value={endDate}
                            onChange={newValue => setEndDate(newValue)}
                            width="320px"
                        />
                    </Box>
                </Box>
                <Box paddingBottom={3}>
                    <Box display="flex">
                        <Text marginX={3} flex={1} justifyContent='flex-start'><b>Labels</b></Text>
                        <Text marginX={3} flex={1} justifyContent='flex-end'><b>Attachments</b></Text>
                    </Box>
                    <Box marginY={1} marginTop={2} display="flex">
                        <Text as={'p'} marginX={3} flex={1} justifyContent='flex-start'>Board Destination</Text>
                        <Text marginX={3} flex={1} justifyContent='flex-end'>List Destination</Text>
                    </Box>
                    <Box display="flex">
                        <Select
                            flex={1} justifyContent='flex-start' marginX={3}
                            options={fieldOptions.labels}
                            value={label}
                            onChange={newValue => setLabel(newValue)}
                            width="320px"
                        />
                        <Select
                            flex={1} justifyContent='flex-start' marginX={3}
                            options={fieldOptions.attachments}
                            value={attachment}
                            onChange={newValue => setAttachment(newValue)}
                            width="320px"
                        />
                    </Box>
                </Box>

                <Box display="flex" alignItems="center" paddingX={1} paddingRight={1} marginBottom={2}>
                    <Button
                        style={{
                            "backgroundColor": secrets.REACT_THEME_DARK_COLOR
                        }}
                        flex={1} variant="primary" marginLeft={1} marginTop={1} justifyContent='flex-start' onClick={() => setIsDialogOpen(true)} icon="switcher">
                        Create Cards in Trello
                    </Button>
                </Box>

                <ProgressBar
                    progress={progress}
                    barColor={secrets.REACT_THEME_LIGHT_COLOR}
                />
                {isDialogOpen && (
                    <Dialog onClose={() => viewRowCount(view)} width="320px">
                        <Dialog.CloseButton />
                        <Heading>Confirm Operation</Heading>
                        <Text variant="paragraph">
                            You are about to use {rows} credits for {rows} rows in this operation. Would you like to proceed?
                        </Text>
                        <Box paddingTop={3} display="flex">
                            <Button style={{
                                "backgroundColor": secrets.REACT_THEME_DARK_COLOR
                            }} marginX={1} flex={1} justifyContent='flex-start' variant="primary" onClick={() => { setIsDialogOpen(false); createCards(view, setProgress, rows, setErrorDialogOpen, board, list, title, desc, startDate, endDate, label, attachment) }}>Proceed</Button>
                            <Button marginX={1} flex={1} justifyContent='flex-start' onClick={() => setIsDialogOpen(false)}>Close</Button>

                        </Box>
                    </Dialog>
                )}

{ErrorDialogOpen && (
                    <Dialog onClose={() => viewRowCount(view)} width="320px">
                        <Dialog.CloseButton />
                        <Heading>⚠️ Error in Operation</Heading>
                        <Text variant="paragraph">
                            {ErrorDialogOpen}
                        </Text>
                        <Box paddingTop={3} display="flex">
                            <Button style={{
                                "backgroundColor": secrets.REACT_THEME_DARK_COLOR
                            }} variant="primary" marginX={1} flex={1} justifyContent='flex-start' onClick={() => { setErrorDialogOpen(false); window.open("mailto:support@einfach.in") }}>Email Us</Button>
                            <Button marginX={1} flex={1} justifyContent='flex-start' onClick={() => setErrorDialogOpen(false)}>Close</Button>
                        </Box>
                    </Dialog>
                )}
            </Box>
                <Box display="flex" alignItems="center" padding={3} marginBottom={2}>
                </Box>
            </Box>

        </div>
    )
}