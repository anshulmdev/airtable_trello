import { initializeBlock, Loader, Box } from '@airtable/blocks/ui';
import React, { useState, useEffect } from 'react';
import { MainView } from "./MainView";
import {TrelloOAuth} from "./Dialog";

function HelloWorldApp() {
    const [data, updateData] = useState(true);
    const [trelloToken, setToken] = useState(false);
    useEffect(() => {
        const getData = async () => {
            // const setInitialVariables = await setGlobalVariables();
            // updateData(setInitialVariables);
        }
        getData();
      }, []);

    return <div>
      {trelloToken ? <b> Working</b> : <TrelloOAuth title = "Connection Issue" description = "Please complete Trello Connection with Airtable" />}
        {data ? <MainView />: 
          <Box style={{
            paddingTop: "100px",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Loader scale={0.3} />
            <p style={{paddingLeft:"10px"}}>Please Wait....</p>
          </Box>
          }
    </div>;
}

initializeBlock(() => <HelloWorldApp />);

