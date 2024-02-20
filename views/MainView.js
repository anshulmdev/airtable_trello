import React, { useState } from "react";
import { base } from '@airtable/blocks';
import { Tooltip, Text, Icon, Box} from "@airtable/blocks/ui";
import { globalConfig } from '@airtable/blocks';
import secrets from "../secrets.json";
import { Trello } from "./Trello";


export const MainView = () => {
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
            </Box>

        </div>
    )
}