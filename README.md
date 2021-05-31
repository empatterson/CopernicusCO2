# Final Project

## Objective
During this tutorial, I will be explaining use of the Google Earth Engine Code editor to map and calculate Co2 changes in China during the Covid Lockdowns of 2020.  
When importing this dataset, I looked at a few countries and regions before choosing which boundary to focus on. I decided to settle on China for this section 
of code because according to the Union of Concerned Scientists, they are the largest contributor to CO2 emissions in the world with 28% contribution according to 2020 stats. 

### Data
The data comes from Copernicus, the European Unions Earth Observation Program and provides high-resolution imagery of CO2 concentrations around the 
world collected from the Sentinel 5P TROPOMI satellite. This code specifically looks at the CO2 Density values, using the band, "CO_column_number_density" which is measured in 
micromolicules. 

### Process
First import the data, select the band and the time period. This is done two times to select two different years, 2019 and then for 2020. 

```js
//Import image collection, filter by date and band
var America19 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                        .filter(ee.Filter.date('2019-01-01', '2019-12-31'))
                        .select('CO_column_number_density');
```

Next, create a mask to crop the worldwide data set into desired output. I used the country_co field to select China. 

```js
//Defines a mask to clip the data collection of wordlwide boundaries, then selects country
var mask = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_co', 'CH'));  
```

Once the data is cropped to the desired boundaries, the mean CO2 values can be calculated for each year using Reducer.mean to aggregate the data over the whole year.  

```js
//find the mean CO2 values for 2019 & 2020
var total19 = America19.reduce(ee.Reducer.mean()).clip(mask)

var total20= America20.reduce(ee.Reducer.mean()).clip(mask)
```

Before adding the mean Co2 layers to the output map, set some visualization parameters like where the map will zoom and the color palett used. 

```js
//Center the map around the defined mask area and set zoom level
Map.centerObject(mask,4);

//Define visualization parameters
var band_viz = {
  min: 0,
  max: 0.05,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
}; 
```
With these parameters set, the two map layers can be correctly displayed on the map. 

```js
//Add mean CO2 layers to map as 2 seperate years
Map.addLayer(America19.mean().clip(mask), band_viz, 'Mean 2019');
Map.addLayer(America20.mean().clip(mask), band_viz, 'Mean 2020');
```

To calculate the mean CO2 levels within China for each year, the mean.reducer can be used again to find the mean for the whole country

```js
//Calculate Statistics on the mean levels for each year
var stats19 = total19.reduceRegion({
  reducer: ee.Reducer.mean(), 
  geometry: mask.geometry(),
  scale: 5000
  })
```

Using the print function, the mean values for both 2019 and 2020 can be compared. 

## Conclusions 

According to this analysis of Co2 rates in China, the rate of CO2 emissions increased between the year of 2019 to 2020. This analysis is only a small part of analyzing atmospheric  changes during the Covid 19 pandemic.  

### References
https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S5P_OFFL_L3_CO?hl=nl#bands

https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S5P_OFFL_L3_CO#description

https://www.ucsusa.org/resources/each-countrys-share-co2-emissions


