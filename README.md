# Catan, a 3D Javascript remake of the board game

## Server 
NodeJS server managing the whole game. Contains two folders:

- `server_mgmt`, to handle the socket connections to the server and the communication with the clients
- `game_mgmt`, to actually run the game and handle the client interactions with the game instnace

Includes a basic TurnSystem, a Board, a Graph representation of the board.

## Client
React framework serves as a base for a ThreeJS instance.
Uses React to server the GUI and handle the interactions with it, while ThreeJS is used to render the actual 3D board. 
The interaction between the twos gathers data from the game running on the server, and displays it on screen.

## Puppet
Sperimentation for testing using `puppeteer`. 

## Status: not even close to finished
