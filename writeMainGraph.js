const { MongoClient } = require('mongodb');
var jannikWins;
var philipWins;
var lisaWins;
var janWins;
var Games;

async function main(){
    const uri = "mongodb+srv://admin:1234@beerpongcluster.ucpzs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        //load all player data
        const loadedJannik = await loadPlayerByName(client,"Jannik");
        const loadedLisa = await loadPlayerByName(client,"Lisa");
        const loadedPhilip = await loadPlayerByName(client,"Philip");
        const loadedJan = await loadPlayerByName(client, "Jan");

        //extract graph information
        jannikWins = loadedJannik["wins"];
        philipWins = loadedPhilip["wins"];
        lisaWins = loadedLisa["wins"];
        janWins = loadedJan["wins"];
        Games = loadedJan["games"];

        //set up output stream
        var fs = require('fs');
        var toBeWrittenName = "createChart.js";  
        var stream = fs.createWriteStream(toBeWrittenName);

        stream.once('open', function(fd){
            var script = buildScript(jannikWins,philipWins,lisaWins,janWins,Games);

            stream.end(script);
        });



    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
        console.log("created Script for MainGraph");
    }
}

main().catch(console.error);

async function loadPlayerByName(client,name){
    const result = await client.db("beerStatistic").collection("Players").findOne({name : name});
    if(result){
        console.log('Found ' + name + ' in database');
    } else {
        console.log('Did not find' + name);
    }
    return result;
}

function buildScript(jannikWins, philipWins, lisaWins, janWins, Games){
    var result = "";
    result += "google.charts.load('current', {'packages':['corechart']});";
    result += "\n";
    result += "\ngoogle.charts.setOnLoadCallback(drawChart);";
    result += "\n";
    result += "\nfunction drawChart() {";
    result += "\n";
    result += "\nvar data = new google.visualization.DataTable();data.addColumn('string', 'Name');data.addColumn('number', 'Wins');";
    result += "\ndata.addRows([['Jan', "+ janWins + "],['Lisa', "+ lisaWins + "],['Jannik',"+ jannikWins + "], ['Philip', "+ philipWins + "],['Spiele'," + Games + "] ]);";
    result += "\n";
    result += "\nvar options = {'title':'Anzahl Siege pro Spieler','width':500,'height':300};";
    result += "\n";
    result += "\nvar chart = new google.visualization.BarChart(document.getElementById('chart_div')); chart.draw(data, options);}";
    return result;

}










