import React, { useState } from "react";
import secrets from "../secrets.json";
import { Dialog, Text, Box, Heading, Button } from "@airtable/blocks/ui";




export const TrelloOAuth = (data) => {
    const [isDialogOpen, setIsDialogOpen] = useState(true);

    return (
        <div>
            {isDialogOpen && (
                <Dialog width="320px">
                    <Dialog.CloseButton />
                    <Text><b>{data.title}</b></Text>
                    <Text variant="paragraph">
                        {data.description}
                    </Text>
                    <Box paddingTop={3} display="flex">
                        <Button style={{
                            "backgroundColor": secrets.REACT_THEME_DARK_COLOR
                        }} variant="primary" flex={1} justifyContent='flex-start' onClick={() => { setIsDialogOpen(false) }}>Connect Trello Account</Button>
                    </Box>
                </Dialog>
            )}
        </div>
    )


}