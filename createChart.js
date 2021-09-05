google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart);

function drawChart() {

var data = new google.visualization.DataTable();data.addColumn('string', 'Name');data.addColumn('number', 'Wins');
data.addRows([['Jan', 8],['Lisa', 7],['Jannik',3], ['Philip', 2],['Spiele',10] ]);

var options = {'title':'Anzahl Siege pro Spieler','width':500,'height':300};

var chart = new google.visualization.BarChart(document.getElementById('chart_div')); chart.draw(data, options);}