//Import image collection, filter by date and band
var America19 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                        .filter(ee.Filter.date('2019-01-01', '2019-12-31'))
                        .select('CO_column_number_density');
                        
var America20 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                        .filter(ee.Filter.date('2020-01-01', '2020-12-31'))                
                        .select('CO_column_number_density');
                        
//Defines a mask to clip the data collection of wordlwide boundaries, then selects continent
var mask = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_co', 'CH'));  
  
//find the cumulative rainfall and show on map
var total19 = America19.reduce(ee.Reducer.sum()).clip(mask)

var total20= America20.reduce(ee.Reducer.sum()).clip(mask)

//Center the map around the defined mask area
Map.centerObject(mask,3);

var band_viz20 = {
  min: 0,
  max: 0.05,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
}; 

Map.addLayer(America19.mean().clip(mask), band_viz, 'Mean 2019');
Map.addLayer(America20.mean().clip(mask), band_viz, 'Mean 2020');

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

print(stats19, 'Mean CO2 2019')
print(stats20, 'Mean CO2 2020')

