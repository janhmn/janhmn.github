const { MongoClient } = require('mongodb');


async function main() {
    const uri = "mongodb+srv://admin:1234@beerpongcluster.ucpzs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        const playerCursor = await client.db("beerStatistic").collection("Players").find().sort({ wins: -1 });
        const playerData = await playerCursor.toArray();

        const gamesCursor = await client.db("beerStatistic").collection("Games").find();
        const gamesData = await gamesCursor.toArray();

        var maximumStreak = await calculateStreak(playerData, gamesData);


        var fs = require('fs');
        var toBeWrittenName = "index.html";
        var stream = fs.createWriteStream(toBeWrittenName);

        stream.once('open', function (fd) {
            var html = buildHtml(playerData, maximumStreak);

            stream.end(html);
        });



    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);


function buildHtml(data, maximumStreak) {
    var count = 0;

    //create the header in new HTML document
    var header = '<meta charset="UTF-8">';
    header += '\n<link rel="stylesheet" type="text/css" href="styles.css">';
    header += '\n<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>';
    header += '\n<script type="text/javascript" src="createChart.js"></script>';
    header += '\n<title>Statistiken</title>'


    var body = '<h1>Bierpong-Statistiken Luisenstraße 17</h1>';
    body += '\n<div class="grid-container">';
    body += '\n<div id="generalTable">';
    body += '\n<table>';
    body += '\n<tr><th>Platz</th><th>Spieler</th><th>Siege</th><th>Spiele</th> <th>Quote</th></tr>';
    data.forEach(doc => {
        count++;
        body += "\n <tr> <td>" + count + ".</td><td>" + doc["name"] + "</td><td>" + doc["wins"] + "</td> <td>" + doc["games"] + "</td><td>" + Math.round((doc["wins"] / doc["games"]) * 100) + "%</td> </tr>";
    })
    body += '\n</table>';
    body += '\n</div><div id="chart_div"> </div></div>';

    //add the streak section
    body += '\n<div class="grid-container">';
    body += '\n<div class="streak"><label class="fire">On fire!</label>';
    body += '\n<p class="content">' + maximumStreak['name'] + ' has the longest Streak with ' + maximumStreak['streak'] + ' wins in a row.</p></div>';


    // concatenate header string
    // concatenate body string

    return '<!DOCTYPE html>'
        + '<html><head>' + header + '</head>' + '\n' + '<body>' + body + '</body></html>';
};

async function calculateStreak(playerData, gameData) {
    var name = '';
    var streak = 0;
    playerData.forEach(player => {
        value = getStreakByName(player['name'] , gameData)
        if(value > streak){
            streak = value;
            name = player['name'];
        }
    });

    return {
        'name' : name,
        'streak': streak
    };
}

function getStreakByName(name, data) {
    var counter = 0;
    var maxStreak = 0;

    data.forEach(element => {
        winners = element['winners'];
        loosers = element['loosers'];

        //increment counter when player is in wins
        if (winners[0] == name || winners[1] == name) {
            counter++;
        }

        //reset counter if player lost + save value
        if (loosers[0] == name || loosers[1] == name) {
            if (counter >= maxStreak) {
                maxStreak = counter;
                counter = 0;
            } else {
                counter = 0;
            }
        }
    });

    return maxStreak;
}

