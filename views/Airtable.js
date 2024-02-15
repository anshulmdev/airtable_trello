import React, { useState } from "react";
import { base } from '@airtable/blocks';
import { Box, TablePicker, ViewPicker, Text, Icon } from "@airtable/blocks/ui";



export const Airtable = () => {
    const [table, setTable] = useState(base.tables[0]);
    const [view, setView] = useState(table.views[0]);
    return (
        <div>
            <Box  style={{'borderStyle': 'dashed', 'borderRadius': 1, 'borderWidth': 1}} margin={2} paddingY={2}>
            <Box display="flex" alignItems="center"  paddingX={3} paddingBottom={1} paddingTop={2}>
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
                    onChange={newTable => { setTable(newTable); setView(newTable.views[0]);}}
                    width="320px"
                />
                <ViewPicker
                    flex={1} justifyContent='flex-start' marginX={3}
                    table={table}
                    view={view}
                    onChange={newView => { setView(newView);}}
                    width="320px"
                />
            </Box>
            </Box>
        </div>
    )
}