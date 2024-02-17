import { initializeBlock, Loader, Box } from '@airtable/blocks/ui';
import { globalConfig } from '@airtable/blocks';
import React, { useState, useEffect } from 'react';
import { MainView } from "./MainView";
import {TrelloOAuth} from "./Dialog";
import {setGlobalVariables} from "../controllers/globalConfig";

function HelloWorldApp() {
    const [data, updateData] = useState(true);
    const trelloToken = globalConfig.get("trelloToken");
    useEffect(() => {
        const getData = async () => {
            // const setInitialVariables = await setGlobalVariables();
            // updateData(setInitialVariables);
        }
        getData();
      }, []);

    return <div>
        {data ? <div><MainView /> 
        {trelloToken ? <div></div> : <TrelloOAuth title = "Connection Issue" description = "Please provide Trello Token to use this Extension" />}
        </div>: 
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

