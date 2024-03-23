import React, { useState } from "react";
import secrets from "../secrets.json";
import { Dialog, Text, Box, Heading, Button, FormField, Input } from "@airtable/blocks/ui";
import { storeToken } from "../controllers/globalConfig";




export const TrelloOAuth = (data) => {
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [successDialogOpen, setSuccessDialog] = useState(false);
    const [trelloToken, setToken] = useState("");


    const getToken = async () => {
        const url = `https://trello.com/1/authorize?return_url=https://einfach-apps.tiiny.site&callback_method=fragment&scope=read,write&expiration=30days&name=Einfach - Airtable to Trello&key=da0da023dd62c5f1415a877621fabc6a&response_type=token`;
        const newwindow = window.open(url, 'name', 'height=200,width=150');
        if (window.focus) { newwindow.focus() }
        return true

    }

    return (
        <div>
            {isDialogOpen && (
                <Dialog onClose={() => setIsDialogOpen(true)} width="320px">
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
                        }} variant="primary" flex={1}  justifyContent='flex-start' onClick={() => {{ storeToken(trelloToken, setIsDialogOpen, setSuccessDialog); setIsDialogOpen(false) }}}>Store Token</Button>

                    </Box>
                </Dialog>
            )}
            {successDialogOpen && (
                        <Dialog onClose={() => {location.reload(); setSuccessDialog(true);}} width="320px">
                            <Dialog.CloseButton />
                            <Heading><b>Your token stored successfully!</b></Heading>
                            <Text variant="paragraph">
                                You can start syncing your cards now !!!
                            </Text>
                            <Box paddingTop={3} display="flex">
                                <Button style={{
                                    "backgroundColor": secrets.REACT_THEME_DARK_COLOR
                                }} variant="primary" marginX={1} flex={1} justifyContent='flex-start' onClick={() => { setSuccessDialog(false); window.open("mailto:support@einfach.in") }}>Email Us</Button>
                                <Button marginX={1} flex={1} justifyContent='flex-start' onClick={() => setSuccessDialog(false)}>Close</Button>
                            </Box>
                        </Dialog>
                    )}
        </div>
    )


}