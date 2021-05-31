//Import image collection, filter by date and band
var America19 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                        .filter(ee.Filter.date('2019-01-01', '2019-12-31'))
                        .select('CO_column_number_density');
                        
var America20 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                        .filter(ee.Filter.date('2020-01-01', '2020-12-31'))                
                        .select('CO_column_number_density');
                        
//Defines a mask to clip the data collection of wordlwide boundaries, then selects country
var mask = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_co', 'CH'));  
  
//find the mean CO2 values for 2019 & 2020
var total19 = America19.reduce(ee.Reducer.mean()).clip(mask)

var total20= America20.reduce(ee.Reducer.mean()).clip(mask)

//Center the map around the defined mask area and set zoom level
Map.centerObject(mask,4);

//Define visualization parameters
var band_viz = {
  min: 0,
  max: 0.05,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
}; 

//Add mean CO2 layers to map as 2 seperate years
Map.addLayer(America19.mean().clip(mask), band_viz, 'Mean 2019');
Map.addLayer(America20.mean().clip(mask), band_viz, 'Mean 2020');

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



