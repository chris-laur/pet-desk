# PetDesk Sample Project

## Demo

[Demo](https://chris-laur.github.io/pet-desk/)

You can see the app in action using the Demo link above. The client is hosted on GitHub Pages and the API is hosted on Azure.

\*Note: might take a second to wake up the hosted API and get the data on initial load.

## How to run

Instructions are based on using VS Code.

### Client

The client is a React app. [Vite](https://vitejs.dev/guide/) was used to get it off the ground.

The client repo is located [here](https://github.com/chris-laur/pet-desk).

To run the app locally:

-   Pull the code down from the repo
-   Open the folder containing the code in VS Code
-   Type 'yarn start' in the VS Code Terminal

\*Note: you won't see any data loaded until you run the API locally.

### API

The API is a .NET Core minimal Web API written in C#.

The API repo is located [here](https://github.com/chris-laur/pet-desk-api).

The API is hosted [here](https://petdeskapi2.azurewebsites.net).

To run the app locally:

-   Pull the code down from the repo
-   Open the folder containing the code in VS Code
-   Type Ctrl+F5

\*Note: you won't see anything on the root path when the app is launched in the browser but if you have started the client app you can now refresh it and see the data fetched from the API.
