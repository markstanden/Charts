const csvURL = 'https://markstanden.github.io/Charts/csv/EU-Covid19-Dataset.csv';


// The 27 EU states without the UK, the strings need to marry up with the country heading in the EU data set (countriesAndTerritories)
const EUnoUK = [
                'Austria',
                'Belgium',
                'Bulgaria',
                'Croatia',
                'Cyprus',
                'Czechia',
                'Denmark',
                'Estonia',
                'Finland',
                'France',
                'Germany',
                'Greece',
                'Hungary',
                'Ireland',
                'Italy',
                'Latvia',
                'Lithuania',
                'Luxembourg',
                'Malta',
                'Netherlands',
                'Poland',
                'Portugal',
                'Romania',
                'Slovakia',
                'Slovenia',
                'Spain',
                'Sweden'
               ];

const UK = [
            'United_Kingdom'
           ];

var reducedSet = {
                  'basicData' : [], // This is the raw data, but onlt for countries within the EU (incl UK)
                  'reducedFull' : [],   // This is the daily sums for the EU relevant dates
                  'reducedSpainSlice' : [], // daily sums sliced for the spanish death adjustment
                  'reducedUKSlice' : [] // the daily sums looking at the UK death rate compared to the EU as a whole for the start of june
                 };

function onPageLoad() {
    init(csvURL);
}

function init(url) {
    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {
            
            // reduce the dataset to EU, UK
            reducedSet.basicData = reduce(results.data);
            
            // Convert the dataset into daily sums so they can be charted
            reducedSet.reducedFull = sumByDate(reducedSet.basicData);
            
            // send the dataset to google and draw the charts
            passToGoogleMain(reducedSet.reducedFull);

            //cut out bits of the data to highlight in separate charts
            reducedSet.reducedSpainSlice = dateSlice(reducedSet.reducedFull, '23/05/2020', '27/05/2020');
            passToGoogleSpain(reducedSet.reducedSpainSlice);
            
            // The UK death reate overtaking the EU as a whole
            reducedSet.reducedUKSlice = dateSlice(reducedSet.reducedFull, '01/06/2020', '07/06/2020');
            passToGoogleUK(reducedSet.reducedUKSlice);
        }
    })
}

function reduce(wholeDataSet) {
    let reducedDataSet = [];
    wholeDataSet.forEach (function(dataRows) {
        
        // Since there were none or few cases before march 2020 in the EU28 we can ignore
        // everything before then to keep the chart more relevant
        if ((parseInt(dataRows.year) === 2020) && (parseInt(dataRows.month) > 2)) {
            
            // create the date string for each data entry.
            // This will be used as the object key when converted.
            let year = dataRows.year.toString().padStart(4, "0")
            let month = dataRows.month.toString().padStart(2, "0")
            let day = dataRows.day.toString().padStart(2, "0")
            let date = day + '/' + month + '/' + year;
                

            if (EUnoUK.includes(dataRows['countriesAndTerritories'])) {
                
                //if in the EU 27 (not UK) put deaths in the EU column
                reducedDataSet.push([date, 0, parseInt(dataRows['deaths'])]);

            } else if (UK.includes(dataRows['countriesAndTerritories'])) {
            
                //if in the UK put the deaths in the UK column
                reducedDataSet.push([date, parseInt(dataRows['deaths']), 0]);
            }
        }

    });
    // return the reduced object Dataset.
    // This is an array of many entries,
    // many sharing the same date
    return reducedDataSet;
};

function sumByDate(individualReports) {
    // The data is currently multiple entries on the same day,
    // we need one total per day to graph

    // dictionary with the date as a key
    let dailySums = {};

    // iterate each entry
    individualReports.forEach(function (row) {
        
       if (row[0] in dailySums) {
            
            // if the date key is already in the dictionary,
            //add the new entries totals to the existing data
            dailySums[row[0]] = [dailySums[row[0]][0] + row[1],
                                 dailySums[row[0]][1] + row[2]
                                ];
        } else {

            // if the key doesn't exist yet, 
            // add a new one with the date as the key
             dailySums[row[0]] = [row[1], row[2]]
        }
    });

    // Now we have a dictionary of dates with the totals behind the date key.
    // Google wants a flat array, with the date as the first column

    let flatArray = [];

    // iterates the object, providing the key in each iteration.
    // We use the key to get at the data each time
    Object.keys(dailySums).forEach(function (key, index) {
        
        // This gives the flat array we need.
        flatArray[index] = [key,
                            dailySums[key][0],
                            dailySums[key][1],
                            ];
    });

    //Sort the array into date order
    flatArray.sort(function(a, b) {
        return 1; // a first, then b
    });
   

    //add the header for google charts to read
    flatArray.unshift(['Date', 'UK', 'EU27']);

    return flatArray;
};

function dateSlice(dataSet, startDate, endDate) {
    // reducedSet.reducedFull, '22/05/2020', '24/05/2020'
    //needs a sorted array
    let startIndex = 0;
    let endIndex = 0;

    // Lets get the start and end indices for the slice
    dataSet.forEach(
        function (day, index) {
            
            if (day[0] === startDate) {
                startIndex = index;
            } else if (day[0] === endDate) {
                endIndex = index;
            }
        }
    );
    
    // slice the array using the indices gained above
    let slicedArray = dataSet.slice(startIndex, (endIndex+1));

    // We need to put the header back on for google charts to read
    slicedArray.unshift(['Date', 'UK', 'EU27']);

    //return the sliced, headed array
    return slicedArray;
}
// Wait until the Page has loaded (for user experience) then
window.addEventListener('DOMContentLoaded', onPageLoad());