import React from 'react';
import { UserProvider } from './UserContext';
import { MatchesProvider } from './MatchesContext';
import { PlayersProvider } from './PlayersContext';
import { ClubsProvider } from './ClubsContext';

export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <MatchesProvider>
        <PlayersProvider>
          <ClubsProvider>
            {children}
          </ClubsProvider>
        </PlayersProvider>
      </MatchesProvider>
    </UserProvider>
  );
};
