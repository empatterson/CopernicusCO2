# FinalProject

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

Once the data is cropped to the desired boundaries, the mean values can be calculated for each year

```js
//find the mean CO2 values for 2019 & 2020
var total19 = America19.reduce(ee.Reducer.mean()).clip(mask)

var total20= America20.reduce(ee.Reducer.mean()).clip(mask)
```
