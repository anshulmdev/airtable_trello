import React, { useState } from "react";
import secrets from "../secrets.json";
import { Dialog, Text, Box, Heading, Button, FormField, Input } from "@airtable/blocks/ui";
import { storeToken } from "../controllers/globalConfig";




export const TrelloOAuth = (data) => {
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [trelloToken, setToken] = useState("");


    const getToken = async () => {
        const url = `https://trello.com/1/authorize?return_url=https://einfach.in/&callback_method=fragment&scope=read,write&expiration=30days&name=Einfach - Airtable to Trello&key=da0da023dd62c5f1415a877621fabc6a&response_type=token`;
        const newwindow = window.open(url, 'name', 'height=200,width=150');
        if (window.focus) { newwindow.focus() }
        return true

    }

    return (
        <div>
            {isDialogOpen && (
                <Dialog onClose={() => setIsDialogOpen(false)} width="320px">
                    <Dialog.CloseButton />
                    <Text><b>{data.title}</b></Text>
                    <Text variant="paragraph">
                        {data.description}
                    </Text>
                    <Box paddingTop={2} display="flex">
                        <FormField label="Enter Trello Token">
                            <Input value={trelloToken} onChange={e => setToken(e.target.value)} />
                        </FormField>

                    </Box>
                    <Box display="flex">
                        <Button style={{
                            "backgroundColor": secrets.REACT_THEME_LIGHT_COLOR
                        }} variant="primary" marginRight={2} flex={1} justifyContent='flex-start' onClick={() => { getToken() }}>Get Trello Token</Button>

<Button style={{
                            "backgroundColor": secrets.REACT_THEME_DARK_COLOR
                        }} variant="primary" flex={1}  justifyContent='flex-start' onClick={() => {{ storeToken(trelloToken, setIsDialogOpen); setIsDialogOpen(false) }}}>Store Token</Button>

                    </Box>
                </Dialog>
            )}
        </div>
    )


}