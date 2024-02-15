import React, { useState } from "react";
import { base } from '@airtable/blocks';
import { Box, TablePicker, ViewPicker, Text } from "@airtable/blocks/ui";



export const Airtable = () => {
    const [table, setTable] = useState(base.tables[0]);
    const [view, setView] = useState(table.views[0]);
    return (
        <div>
            <Box paddingTop={3} display="flex">
                <Text marginX={3} flex={1} justifyContent='flex-start'><b>Table</b></Text>
                <Text marginX={3} flex={1} justifyContent='flex-end'><b>View</b></Text>
            </Box>
            <Box marginY={1} marginTop={2} display="flex">
                <Text as={'p'} marginX={3} flex={1} justifyContent='flex-start'>Prepare excel as per selected table</Text>
                <Text marginX={3} flex={1} justifyContent='flex-end'>Select filtered view for export</Text>
            </Box>
            <Box display="flex">
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
        </div>
    )
}