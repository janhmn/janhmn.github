const { MongoClient } = require('mongodb');


async function main() {
    const uri = "mongodb+srv://admin:1234@beerpongcluster.ucpzs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        const cursor = await client.db("beerStatistic").collection("Players").find().sort({ wins: -1 });
        const data = await cursor.toArray();

        var fs = require('fs');
        var toBeWrittenName = "index.html";
        var stream = fs.createWriteStream(toBeWrittenName);

        stream.once('open', function (fd) {
            var html = buildHtml(data);

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


function buildHtml(data) {
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
        body += "\n <tr> <td>" + count + ".</td><td>" + doc["name"] + "</td><td>" + doc["wins"] + "</td> <td>" + doc["games"] + "</td><td>" + (doc["wins"]/doc["games"]) *100 + "%</td> </tr>";
    })
    body += '\n</table>';
    body += '\n</div><div id="chart_div"> </div></div>';



    // concatenate header string
    // concatenate body string

    return '<!DOCTYPE html>'
        + '<html><head>' + header + '</head>' + '\n' + '<body>' + body + '</body></html>';
};


