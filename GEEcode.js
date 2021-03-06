//Import image collection, filter by date and band
var China19 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                        .filter(ee.Filter.date('2019-01-01', '2019-12-31'))
                        .select('CO_column_number_density');
                        
var China20 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                        .filter(ee.Filter.date('2020-01-01', '2020-12-31'))                
                        .select('CO_column_number_density');
                        
//Defines a mask to clip the data collection of wordlwide boundaries, then selects country
var mask = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_co', 'CH'));  
  
//find the mean CO2 values for 2019 & 2020
var total19 = China19.reduce(ee.Reducer.mean()).clip(mask)

var total20= China20.reduce(ee.Reducer.mean()).clip(mask)

//Center the map around the defined mask area and set zoom level
Map.centerObject(mask,4);

//Define visualization parameters
var band_viz = {
  min: 0,
  max: 0.05,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
}; 

//Add mean CO2 layers to map as 2 seperate years
Map.addLayer(China19.mean().clip(mask), band_viz, 'Mean 2019');
Map.addLayer(China20.mean().clip(mask), band_viz, 'Mean 2020');

//Calculate Statistics on the mean levels for each year
var stats19 = total19.reduceRegion({
  reducer: ee.Reducer.mean(), 
  geometry: mask.geometry(),
  scale: 5000
  })

var stats20 = total20.reduceRegion({
  reducer: ee.Reducer.mean(), 
  geometry: mask.geometry(),
  scale: 5000
  })

//Print the mean levels of CO2 in the console tab
print(stats19, 'Mean CO2 2019')
print(stats20, 'Mean CO2 2020')

///This section of code does not run:
// Define a chart of mean values and print it to the console.
var chart = ui.Chart.image
                .doySeriesByYear({
                  imageCollection: total19,
                  bandName: 'CO_column_number_density',
                  region: mask.geometry(),
                  scale: 5000,
                  regionReducer: ee.Reducer.mean(),
                  sameDayReducer: ee.Reducer.mean(),
                  startDay: 60,
                  endDay: 75
                })
                .setOptions({
                  title: 'Average Co2 Value',
                  hAxis: {
                    title: 'Day of year',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  vAxis: {
                    title: 'Co2 (x1e4)',
                    titleTextStyle: {italic: false, bold: true}
                  },
                  lineWidth: 5,
                  colors: ['39a8a7', '9c4f97'],
                });
print(chart);

