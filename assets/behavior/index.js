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

    var percent = [];

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

                    legend[i].innerHTML = "<span>" + options.series[i].name + "</span> " + percent[i];

                }

            }

            function percentageChange(xaxis) {

                if ((xaxis === undefined) || ((xaxis.min === undefined) && (xaxis.max === undefined))) {
                    
                    for (var x=0; x < options.series.length; x++) {

                        var v1 = options.series[x].data[0][1];
                        var v2 = options.series[x].data[options.series[x].data.length-1][1];

                        percent[x] = ((v2 - v1)/v1) * 100;
                        
                        percent[x] = percent[x].toFixed(2) + "%";
    
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

                    
                    for (var x=0; x < options.series.length; x++) {

                        var v1 = options.series[x].data[minIndex][1];
                        var v2 = options.series[x].data[maxIndex-1][1];

                        percent[x] = ((v2 - v1)/v1) * 100;
                        
                        percent[x] = percent[x].toFixed(2) + "%";
    
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
                    height: 750,
                    stacked: false,
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 200,
                        animateGradually: {
                            enabled: false,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 200
                        }
                    },
                    events: {
                        mounted: function (chartContext, config) {
                            percentageChange();
                        },
                        scrolled: function (chartContext, axes) {
                            percentageChange(axes.xaxis);
                        },
                        zoomed: function (chartContext, axes) {
                            percentageChange(axes.xaxis);
                        }
                    }
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
                    fontSize: '16px',
                    show: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    height: 50,
                    /* offsetY: 40, */
                    itemMargin: {
                        vertical: 0
                    },
                    formatter: function(seriesName, opts) {
                        return ["<span>", seriesName, "</span> ", percent[opts.seriesIndex]];
                    }
                },
                xaxis: {
                    type: 'datetime'
                },
                yaxis: {
                    show: false
                },
                tooltip: {
                    y: {
                        formatter: function(value, details) {
                            
                            var minIndex = 0;
                            var maxIndex = details.dataPointIndex;

                            for (var i=0; i < options.series[details.seriesIndex].data.length; i++) {

                                if (options.series[details.seriesIndex].data[i][0] > details.w.config.xaxis.min) {

                                    minIndex = i;
                                    break;

                                }

                            }

                            var v1 = options.series[details.seriesIndex].data[minIndex][1];
                            var v2 = options.series[details.seriesIndex].data[maxIndex][1];

                            var percent = ((v2 - v1)/v1) * 100;
                            percent = percent.toFixed(2) + "%";
                        
                            return percent
                        }
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