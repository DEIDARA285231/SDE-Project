# SDE-Project Final Project by Andrea Balasso, Edoardo Schioccola, Alessandro Brighenti
### Service Design and Engineering 2020/21 (UniTN)
### The Project
The project came from the need of a service that could aggregate other useful features in order to get the lowest prices, infos, top streams and reviews for a specific game without the need to search each thing separately. We also offer a feature that compares the lowest prices on different platforms and a price/hrs ration in order to evaluate how much is "worth" playing.
### Setup

Clone the repository, and install all the dependencies by executing the command for every "subfolder" (for ex. IGDB, ITAD, ecc...):

```bash
npm install
```

Run the service executing the command after opening Docker Desktop:

```bash
docker-compose build
docker-compose up
```

The server will automatically restart when the files are changed.
You can either access the endpoint via URLs or via a simple interface (that uses auth services) by using the "localhost:8086" url.
The API documentation can be accessed by accessing "localhost:" + port + /api-docs.
Port is a variable that can be :
8082 for IGDB
8084 for Steam
8085 for Twitch
8083 for ITAD
