import 'dotenv/config';
import * as React from 'react';
import { Client, Token, start, Command } from 'discord-jsx';
import { Monitor } from './components/Monitor';
import { Fetching } from './components/Fetching';

function App() {
  return (
    <Client
      prefix={'|'}
      constructorOptions={{
        presence: {
          activity: {
            name: 'for restocks',
            type: 'WATCHING',
          },
        },
      }}
    >
      <Monitor />
      <Fetching />
      <Command name={'up'} description={'Checks if the bot is up'}>
        Hey, I'm alive!
      </Command>
      <Token token={process.env.TOKEN!} onReady={(client) => console.log(`${client.user?.tag} is ready`)} />
    </Client>
  );
}

start(<App />);
