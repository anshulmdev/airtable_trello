import React, { useState, useEffect } from "react";
import { base, globalConfig } from '@airtable/blocks';
import { Box, Text, Select, Icon, TablePicker, ViewPicker, Button, Dialog, Heading  } from "@airtable/blocks/ui";
import { getBoardList, getLists, fields } from "../controllers/formFields"

import secrets from "../secrets.json";



export const Trello = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [table, setTable] = useState(base.tables[0]);
    const [view, setView] = useState(table.views[0]);
    globalConfig.setAsync("table", table.id);
    globalConfig.setAsync("view", view.id);
    const [boardOptions, setBoardOptions] = useState([]);
    const [listOptions, setListOptions] = useState([]);
    const [board, setBoard] = useState();
    const [list, setList] = useState();
    const [fieldOptions, setFieldOptions] = useState({ titleOptions: [], descriptionOptions: [], dateOptions: [], labels: [], attachments: [] });

    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [label, setLabel] = useState();
    const [attachment, setAttachment] = useState();
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
        setFieldOptions(fieldOptions);
        const { titleOptions, descriptionOptions, dateOptions, labels, attachments, rows } = fieldOptions;
        setRows(rows);
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
                            }} marginX={1} flex={1} justifyContent='flex-start' variant="primary" onClick={() => { setIsDialogOpen(false); demoPayload(table, value, view, setProgress, rows, setErrorDialogOpen) }}>Proceed</Button>
                            <Button marginX={1} flex={1} justifyContent='flex-start' onClick={() => setIsDialogOpen(false)}>Close</Button>

                        </Box>
                    </Dialog>
                )}
            </Box>
        </div>
    )
}