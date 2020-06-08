function passToGoogleMain(dataSet) {
   
    // Load the Visualization API and the piechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawMainChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawMainChart() {
        var data = google.visualization.arrayToDataTable(dataSet);
        
        var options = {
          title: 'UK and EU Corona Virus Death Comparison Figures',
          hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0},
          'chartArea': {'width': '80%', 'height': '70%'},
          'legend': {'position': 'top'}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('google_chart_main'));
        chart.draw(data, options);
      }

}

function passToGoogleSpain(dataSet) {
    console.log('spain' + dataSet);
    // Load the Visualization API and the piechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
        var data = google.visualization.arrayToDataTable(dataSet);
        
        var options = {
          title: 'UK and EU Corona Virus Death Comparison Figures',
          hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0},
          'legend': {'position': 'top'}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('google_chart_spain'));
        chart.draw(data, options);
      }

}

function passToGoogleUK(dataSet) {
   
    // Load the Visualization API and the piechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
        var data = google.visualization.arrayToDataTable(dataSet);
        
        var options = {
          title: 'UK and EU Corona Virus Death Comparison Figures',
          hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0},
          'legend': {'position': 'top'}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('google_chart_UK'));
        chart.draw(data, options);
      }

}