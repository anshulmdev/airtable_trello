import React, { useState, useEffect } from "react";
import { Box, Text, Select, FieldPicker, Icon } from "@airtable/blocks/ui";
import { getBoardList, getLists } from "../controllers/formFields"



export const Trello = () => {
    const [boardOptions, setBoardOptions] = useState([]);
    const [listOptions, setListOptions] = useState([]);
    const [board, setBoard] = useState();
    const [list, setList] = useState();
    
    useEffect(() => {
        const getBoards = async () => {
            const boardList = await getBoardList();
            const lists = await getLists(boardList[0].value);
            setBoardOptions(boardList);
            setBoard(boardList[0].value);
            setListOptions(lists);
            setList(lists[0].value)
            return true
        }
        getBoards();
        
     }, [])
    const [field, setField] = useState(null);
    
    return (
        <div>

            <Box  style={{'borderStyle': 'dashed', 'borderRadius': 1, 'borderWidth': 1}} margin={2} paddingY={2}>

            <Box display="flex" alignItems="center"  paddingX={3} paddingBottom={3} paddingTop={2}>
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
            </Box>
        </div>
    )
}