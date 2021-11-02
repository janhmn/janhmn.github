google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart);

function drawChart() {

var data = new google.visualization.DataTable();data.addColumn('string', 'Name');data.addColumn('number', 'Wins');
data.addRows([['Jan', 10],['Lisa', 13],['Jannik',6], ['Philip', 6]]);

var options = {'title':'Anzahl Siege pro Spieler','width':500,'height':300};

var chart = new google.visualization.BarChart(document.getElementById('chart_div')); chart.draw(data, options);}