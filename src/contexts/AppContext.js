import React from 'react';
import { UserProvider } from './UserContext';
import { MatchesProvider } from './MatchesContext';
import { PlayersProvider } from './PlayersContext';
import { ClubsProvider } from './ClubsContext';
import { ApiProvider } from './ApiContext';
import { NotificationProvider } from './NotificationContext';

export const AppProvider = ({ children }) => {
  return (
    <NotificationProvider>
      <UserProvider>
        <ApiProvider>
          <MatchesProvider>
            <PlayersProvider>
              <ClubsProvider>
                {children}
              </ClubsProvider>
            </PlayersProvider>
          </MatchesProvider>
        </ApiProvider>
      </UserProvider>
    </NotificationProvider>
  );
};
