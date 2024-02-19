import React, { useState } from "react";
import { base } from '@airtable/blocks';
import { Tooltip, ProgressBar, Text, Icon, Box, Heading, Button, Dialog } from "@airtable/blocks/ui";
import { demoPayload } from "../controllers/getTable";
import { globalConfig } from '@airtable/blocks';
import secrets from "../secrets.json";
import { Trello } from "./Trello";


export const MainView = () => {
    const [progress, setProgress] = useState(0.0);
    const [ErrorDialogOpen, setErrorDialogOpen] = useState(false);
    const collaborator = base.activeCollaborators[0];
    const { id } = collaborator;
    const user = globalConfig.get(id);


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
                <Trello />
                <Box display="flex" alignItems="center" padding={3} marginBottom={2}>
                </Box>
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
                <ProgressBar
                    progress={progress}
                    barColor={secrets.REACT_THEME_LIGHT_COLOR}
                />
            </Box>

        </div>
    )
}