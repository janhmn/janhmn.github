const { MongoClient } = require('mongodb');

var args = process.argv;

var namePlayer1 = args[2];
var namePlayer2 = args[3];
var namePlayer3 = args[4];
var namePlayer4 = args[5];

async function main() {
    

    const uri = "mongodb+srv://admin:1234@beerpongcluster.ucpzs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();

        //retrieve the gameCount to determine the next gameId
        const latestGame = await client.db("beerStatistic").collection("Games").find().sort({gameId: -1}).limit(1).toArray();
        const gameCount = latestGame[0]["gameId"] + 1;

        //create the JSON data for the latest gameEntry
        const gameJson = await createJson(namePlayer1, namePlayer2, namePlayer3, namePlayer4,gameCount);

        await createGameEntry(client, gameJson);

        var player1data = await loadPlayerByName(client, namePlayer1);
        console.log(player1data);
        var player2data = await loadPlayerByName(client, namePlayer2);
        console.log(player2data);
        var player3data = await loadPlayerByName(client, namePlayer3);
        console.log(player3data);
        var player4data = await loadPlayerByName(client, namePlayer4);
        console.log(player4data);

        await updatePlayerData(client, namePlayer1, { wins: player1data["wins"] + 1, games: player1data["games"] + 1 });
        await updatePlayerData(client, namePlayer2, { wins: player2data["wins"] + 1, games: player2data["games"] + 1 });
        await updatePlayerData(client, namePlayer3, { games: player1data["games"] + 1 });
        await updatePlayerData(client, namePlayer4, { games: player1data["games"] + 1 });

    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }



}

main().catch(console.error);


async function createJson(p1, p2, p3, p4, count) {
    const jsonData = {
        winners: [p1, p2],
        loosers: [p3, p4],
        gameId: count
    };

    return jsonData;
}

async function createGameEntry(client, game) {
    const result = await client.db("beerStatistic").collection("Games").insertOne(game);
    console.log("Game has been logged!");
}

async function updatePlayerData(client, nameOfPlayer, updatedPlayerData) {
    const result = await client.db("beerStatistic").collection("Players")
        .updateOne({ name: nameOfPlayer }, { $set: updatedPlayerData });

    console.log("updated " + nameOfPlayer + "'s data!");
}

async function loadPlayerByName(client, name) {
    const result = await client.db("beerStatistic").collection("Players").findOne({ name: name });
    if (result) {
        console.log('Found ' + name + ' in database');
    } else {
        console.log('Did not find' + name);
    }
    return result;
}

async function winnerUpdate(playerData) {
    const name = playerData["name"];
    const wins = playerData["wins"];
    const games = playerData["games"];

    var result = {
        name: name,
        wins: wins + 1,
        games: games + 1
    }
    return result;
}

async function looserUpdate(playerData) {
    const name = playerData["name"];
    const wins = playerData["wins"];
    const games = playerData["games"];

    var result = {
        name: name,
        wins: wins,
        games: games + 1
    }
    return result;
}