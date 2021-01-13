/*



	" Reimplement the wheel to either learn, or make it better. "

    http://www.haydex.com/
    https://www.youtube.com/watch?v=QOlTGA3RE8I
    
    Product Name: Btracker
	Description: Tracking Blog's data.
	Beneficiary: COSMOS
	
	Copyright © 1988 - 2020 HAYDEX, All Rights Reserved.
	
	
	
*/



document.addEventListener("DOMContentLoaded", function() {

    // General

    var average = [];

    class General {

        constructor() {

            this.initialize();

        }

        initialize() {

            this.loadChart();

        }

        loadChart() {

            var generateDayWiseTimeSeries = function (baseval, count, yrange) {
                var i = 0;
                var series = [];
                while (i < count) {
                    var x = baseval;
                    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

                    series.push([x, y]);
                    baseval += 86400000;
                    i++;
                }
                return series;
            }

            function updateLegend() {

                var legend = document.querySelectorAll(".apexcharts-legend-text");

                for (var i=0; i < legend.length; i++) {

                    legend[i].innerHTML = "<span>" + options.series[i].name + "</span> " + average[i];

                }

            }

            function calculateAverages(xaxis) {

                
                if ((xaxis === undefined) || ((xaxis.min === undefined) && (xaxis.max === undefined))) {
                    
                    for (var x=0; x < options.series.length; x++) {

                        average[x] = 0;
                        
                        for (var i=0; i < options.series[x].data.length; i++) {
                            
                            average[x] += options.series[x].data[i][1];
        
                        }
        
                        average[x] /= i;
                        
                        average[x] = average[x].toFixed(2);
    
                    }

                } else {
                    
                    var minIndex = 0;
                    var maxIndex = 0;

                    for (var i=0; i < options.series[0].data.length; i++) {

                        if (options.series[0].data[i][0] > xaxis.min) {

                            minIndex = i;
                            break;

                        }

                    }

                    for (var i=0; i < options.series[0].data.length; i++) {
                        
                        if (options.series[0].data[i][0] >= xaxis.max) {

                            maxIndex = i;
                            break;

                        }

                    }
                    
                    for (var x=0; x< options.series.length; x++) {

                        average[x] = 0;
                        
                        for (var i=minIndex, j=0; i <= maxIndex; i++, j++) {
        
                            average[x] += options.series[x].data[i][1];
        
                        }
        
                        average[x] /= j;
        
                        average[x] = average[x].toFixed(2);


                    }

                }

                updateLegend();
                
            }

            var options = {
                series: [
                    {
                        name: 'Anger',
                        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 70, {
                            min: 10,
                            max: 60
                        })
                    },
                    {
                        name: 'Fear',
                        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 70, {
                            min: 10,
                            max: 20
                        })
                    },
                    {
                        name: 'Anticipation',
                        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 70, {
                            min: 10,
                            max: 15
                        })
                    },
                    {
                        name: 'Surprise',
                        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 70, {
                            min: 10,
                            max: 15
                        })
                    },
                    {
                        name: 'Joy',
                        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 70, {
                            min: 10,
                            max: 15
                        })
                    },
                    {
                        name: 'Sadness',
                        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 70, {
                            min: 10,
                            max: 15
                        })
                    },
                    {
                        name: 'Trust',
                        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 70, {
                            min: 10,
                            max: 15
                        })
                    },
                    {
                        name: 'Disgust',
                        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 70, {
                            min: 10,
                            max: 15
                        })
                    }
                ],
                chart: {
                    type: 'area',
                    height: 650,
                    stacked: false,
                    events: {
                        mounted: function (chartContext, config) {
                            calculateAverages();
                        },
                        scrolled: function (chartContext, axes) {
                            calculateAverages(axes.xaxis);
                        },
                        zoomed: function (chartContext, axes) {
                            calculateAverages(axes.xaxis);
                        }
                    },
                },
                colors: ['#70CAD1', '#8390FA', '#FAC748', '#F9E9EC', '#F88DAD', '#B0F2B4', '#BAF2E9', '#F2BAC9'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.6,
                        opacityTo: 0.8,
                    }
                },
                legend: {
                    horizontalAlign: 'left',
                    fontSize: '18px',
                    show: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    height: 0,
                    offsetY: 40,
                    itemMargin: {
                        horizontal: 20,
                        vertical: 10
                    },
                    formatter: function(seriesName, opts) {
                        return ["<span>", seriesName, "</span> ", average[opts.seriesIndex]];
                    }
                },
                xaxis: {
                    type: 'datetime'
                },
                yaxis: {
                    show: false
                },
                tooltip: {
                    onDatasetHover: {
                        highlightDataSeries: false
                    }
                    
                }
                
            };

            var chart = new ApexCharts(document.querySelector("#chart"), options);

            chart.render();

        }

    }



    // Initialization

    let general = new General();

});