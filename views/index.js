import { initializeBlock, Loader, Box, useBase } from '@airtable/blocks/ui';
import { globalConfig } from '@airtable/blocks';
import React, { useState, useEffect } from 'react';
import { MainView } from "./MainView";
import { TrelloOAuth } from "./Dialog";
import { setGlobalVariables, ValidateToken } from "../controllers/globalConfig"

function TrelloAirtable() {
  const base = useBase();
  const [isLoading, setIsLoading] = useState(true);
  const [trelloToken, setTrelloToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await setGlobalVariables();
      const isTokenValid = await ValidateToken();
      if (!isTokenValid) {
        await globalConfig.setAsync('trelloToken', null);
        setTrelloToken(null);
      } else {
        const token = await globalConfig.get('trelloToken');
        setTrelloToken(token);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [base.activeViewId]);

  if (isLoading) {
    return (
      <Box style={{ paddingTop: "100px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader scale={0.3} />
        <p style={{ paddingLeft: "10px" }}>Please Wait....</p>
      </Box>
    );
  }

  return (
    <div>
      <MainView />
      {trelloToken ? null : (
        <TrelloOAuth
          title="Connection Issue"
          description="Please provide Trello Token to use this Extension"
        />
      )}
    </div>
  );
}

initializeBlock(() => <TrelloAirtable />);