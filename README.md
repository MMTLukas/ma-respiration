respiration
===========

Estimation of respiration experiment via accelerator sensor from smartphone.


# Stories

## User stories
- As a user I want to see a counter of my respiratory frequency
- As a user I want to click a start / stop button to begin and end the measurement
- As a user I want to see a live diagram
- As a user I want to see the min an max values of the diagram
- (As a user I want to see an archive with the last few diagrams)

## Developer stories
- As a developer I want to get the values of the z-axis of the accelerometer
- As a developer I want to filter with the simple moving average algorithm the values to get reliable data
- As a developer I want to filter with median filter the values to get reliable data
- As a developer I want to filter with gaussian filter the values to get reliable data
- As a developer I want to create a live diagram with the filtered data
- As a developer I want to calculate the respiratory frequency of the filtered data
- (As a developer I want to save the data in the local storage to archive the data)
