import { initializeBlock, Loader, Box } from '@airtable/blocks/ui';
import React, { useState, useEffect } from 'react';
import { MainView } from "./MainView";
import { setGlobalVariables } from "../controllers/globalConfig";

function HelloWorldApp() {
    const [data, updateData] = useState(true);
    useEffect(() => {
        const getData = async () => {
            // const setInitialVariables = await setGlobalVariables();
            // updateData(setInitialVariables);
        }
        getData();
      }, []);

    return <div>
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

