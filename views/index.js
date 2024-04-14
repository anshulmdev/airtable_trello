import { initializeBlock, Loader, Box, useBase } from '@airtable/blocks/ui';
import { globalConfig } from '@airtable/blocks';
import React, { useState, useEffect } from 'react';
import { MainView } from "./MainView";
import { TrelloOAuth } from "./Dialog";
import { setGlobalVariables, ValidateToken } from "../controllers/globalConfig";

function TrelloAirtable() {
  const base = useBase();
  const [isLoading, setIsLoading] = useState(true);
  const [trelloToken, setTrelloToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await setGlobalVariables();
        const isTokenValid = await ValidateToken();
        if (!isTokenValid) {
          globalConfig.setAsync('trelloToken', null);
          setTrelloToken(null);
        } else {
          const token = globalConfig.get('trelloToken');
          setTrelloToken(token);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [base.activeViewId]);

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="200px">
        <Loader scale={0.3} />
        <Box marginLeft={2}>Please wait...</Box>
      </Box>
    );
  }

  return (
    <div>
      <MainView />
      {trelloToken ? null : (
        <TrelloOAuth
          title="Connection Issue"
          description="Please provide a valid Trello token to use this extension."
        />
      )}
    </div>
  );
}

initializeBlock(() => <TrelloAirtable />);