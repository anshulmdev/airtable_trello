import React, { useState } from "react";
import { Box, Text, Select } from "@airtable/blocks/ui";



export const Trello = () => {
    const boardOptions = [
        { value: "Ideas", label: "Ideas" },
        { value: "Todo", label: "Todo" },
        { value: "Banana", label: "Banana" }
    ];
    const listOptions = [
        { value: "Progress", label: "Progress" },
        { value: "Todo", label: "Todo" },
        { value: "Banana", label: "Banana" }
    ];
    const [board, setBoard] = useState(boardOptions[0].value);
    const [list, setList] = useState(listOptions[1].value);
    return (
        <div>

            <Box display="flex" alignItems="center"  paddingX = {3} paddingTop={2} marginTop={2}>
                <Text flex={1} justifyContent='flex-start'><b>Trello Card Configuration</b></Text>
            </Box>
            <Box  style={{'borderStyle': 'dashed', 'borderRadius': 1, 'borderWidth': 1}} margin={2} paddingY={4}>
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
        </div>
    )
}