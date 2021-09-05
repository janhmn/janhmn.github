const { MongoClient, CURSOR_FLAGS } = require('mongodb');
const fs = require('fs');

async function main() {
    const uri = "mongodb+srv://admin:1234@beerpongcluster.ucpzs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();

        //load all players into Array of Documents
        const cursor = await client.db("beerStatistic").collection("Players").find();
        const data = await cursor.toArray();

        (await data).forEach(doc => {

            //create JSON data for each Player
            const playerData = {
                name: doc["name"],
                games: doc["games"],
                wins: doc["wins"]
            };

            //write JSON file into local system
            fs.writeFile("jsons/" + playerData["name"] + ".json", JSON.stringify(playerData), (err) => {
                if (err) {
                    throw err;
                }
                console.log("JSON has been saved");
            });

        });


    }
    catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

main().catch(console.error);
