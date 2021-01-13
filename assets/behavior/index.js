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

    class General {

        constructor() {

            this.body = document.querySelector("body");
            this.filters = document.querySelectorAll("section#filters ul li");
            this.moreInfoModal = document.querySelector("section#moreInfoModal");
            this.moreInfoModalShadow = document.querySelector("section#moreInfoModal div#shadow");
            this.moreInfoModalContent = document.querySelector("section#moreInfoModal div#messageContent");
            this.moreInfoCloseButton = document.querySelector("section#moreInfoModal div#messageBox button#closeButton");
            this.bottomMessage = document.querySelector("section#notifications");

            this.displayedClass = "displayed";
            this.activeClass = "active";

            this.freezeDocumentScrollingClass = "freeze";

            this.initialize();

        }

        initialize() {

            this.setupD3JS3();

            for (let i = 0; i < this.filters.length; i++) {

                this.filters[i].addEventListener("click", this.filtersClickListener.bind(this));

            }

            this.moreInfoCloseButton.addEventListener("click", this.moreInfoCloseButtonClickListener.bind(this));
            this.moreInfoModalShadow.addEventListener("click", this.moreInfoModalShadowClickListener.bind(this));
            document.addEventListener("keydown", this.escapeKeyListener.bind(this));

        }

        filtersClickListener(event) {

            d3.select("svg").remove();
            this.setupD3JS();
            event.currentTarget.classList.toggle(this.activeClass);

        }

        circleClickListener() {

            this.freezeDocumentScrolling();
            this.moreInfoModal.classList.add(this.displayedClass);
            this.resetScrolling(this.moreInfoModalContent);

        }

        moreInfoCloseButtonClickListener() {

            this.moreInfoModal.classList.remove(this.displayedClass);
            this.unfreezeDocumentScrolling();

        }

        moreInfoModalShadowClickListener() {

            this.moreInfoModal.classList.remove(this.displayedClass);
            this.unfreezeDocumentScrolling();

        }

        freezeDocumentScrolling() {

            this.body.classList.add(this.freezeDocumentScrollingClass);

        }

        unfreezeDocumentScrolling() {

            this.body.classList.remove(this.freezeDocumentScrollingClass);

        }

        resetScrolling(object) {

            object.scrollTop = 0;

        }

        escapeKeyListener() {

            if (window.event.keyCode == 27) {
                this.moreInfoCloseButtonClickListener();
            }
        }

        setupD3JS() {

            var width = 960,
                height = 500,
                padding = 2, // separation between same-color nodes
                clusterPadding = 5, // separation between different-color nodes
                maxRadius = 5;

            var color = d3.scale.ordinal()
                .range(["#e377c2","#8c564b", "#9467bd", "#d62728", "#2ca02c", "#ff7f0e", "#1f77b4", "#7f7f7f"]);
            
            var generalObject = this;

            d3.text("assets/data/data.csv", function(error, text) {
                if (error) throw error;

                var colNames = "title,emotionid,value\n" + text;
                var data = d3.csv.parse(colNames);
                
                data.forEach(function(d) { d.value = +d.value; });
                
                //unique cluster/group id's
                var cs = [];
                data.forEach(function(d){
                        if(!cs.contains(d.emotionid)) {
                            cs.push(d.emotionid);
                        }
                });

                filterData();

                var n = data.length, // total number of nodes
                    m = cs.length; // number of distinct clusters

                //create clusters and nodes
                var clusters = new Array(m);
                var nodes = [];
                for (var i = 0; i<n; i++){
                    nodes.push(create_nodes(data,i));
                }

                var force = d3.layout.force()
                    .nodes(nodes)
                    .size([width, height])
                    .gravity(.02)
                    .charge(0)
                    .on("tick", tick)
                    .start();

                var svg = d3.select("body").append("svg")
                    .attr("viewBox", "0 0 960 500")

                var node = svg.selectAll("circle")
                    .data(nodes)
                    .enter().append("circle")
                    .style("fill", function(d) { return color(d.cluster); })

                var node = svg.selectAll("circle")
                    .data(nodes)
                    .enter().append("g").call(force.drag);

                node.append("circle")
                    .style("fill", function (d) {
                    return color(d.cluster);
                    })
                    .attr("r", function(d){return d.radius})


                var node = svg.selectAll("circle")
                    .on("mouseover", function(d) {
                        d3.select(this).style("cursor", "pointer"); 
                    })
                    .on("mouseout", function(d) {
                        d3.select(this).style("cursor", "default"); 
                    })
                
                
                var node = svg.selectAll("circle")
                    .on("click", generalObject.circleClickListener.bind(generalObject));

                node.transition()
                    .duration(0)
                    .delay(function(d, i) { return i * 5; })
                    .attrTween("r", function(d) {
                    var i = d3.interpolate(0, d.radius);
                    return function(t) { return d.radius = i(t); };
                    });
                
                function create_nodes(data,node_counter) {
                    var i = cs.indexOf(data[node_counter].emotionid),
                        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
                        d = {
                            cluster: i,
                            radius: data[node_counter].value*15,
                            text: data[node_counter].title,
                            x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                            y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
                        };
                    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                    return d;
                };
                
                function tick(e) {
                    node
                        .each(cluster(10 * e.alpha * e.alpha))
                        .each(collide(.5))
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                }

                // Move d to be adjacent to the cluster node.
                function cluster(alpha) {
                    return function(d) {
                        var cluster = clusters[d.cluster];
                        if (cluster === d) return;
                        var x = d.x - cluster.x,
                            y = d.y - cluster.y,
                            l = Math.sqrt(x * x + y * y),
                            r = d.radius + cluster.radius;
                        if (l != r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        cluster.x += x;
                        cluster.y += y;
                        }
                    };
                }

                // Resolves collisions between d and all other circles.
                function collide(alpha) {
                    var quadtree = d3.geom.quadtree(nodes);
                    return function(d) {
                        var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                            nx1 = d.x - r,
                            nx2 = d.x + r,
                            ny1 = d.y - r,
                            ny2 = d.y + r;
                        quadtree.visit(function(quad, x1, y1, x2, y2) {
                        if (quad.point && (quad.point !== d)) {
                            var x = d.x - quad.point.x,
                                y = d.y - quad.point.y,
                                l = Math.sqrt(x * x + y * y),
                                r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                            if (l < r) {
                            l = (l - r) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                            }
                        }
                        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                        });
                    };
                }

                function filterData() {

                    var filters = document.querySelectorAll("section#filters ul li");

                    filters.forEach(function (filter, index) {

                        if (!filter.classList.contains("active")) {

                            data.forEach(function (video, i) {

                                if (video.emotionid == (index + 1)) {

                                    video.value = 0;

                                }

                            });

                        }

                    });
                }

            });

            Array.prototype.contains = function(v) {
                for(var i = 0; i < this.length; i++) {
                    if(this[i] === v) return true;
                }
                return false;
            };

        }

        setupD3JS2() {

            // set the dimensions and margins of the graph
            var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            var svg = d3v4.select("body")
            .append("svg")
            .attr("id", "lineChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

            //Read the data
            d3v4.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) {

            // group the data: I want to draw one line per group
            var sumstat = d3v4.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d) { return d.name;})
            .entries(data);

            // Add X axis --> it is a date format
            var x = d3v4.scaleLinear()
            .domain(d3v4.extent(data, function(d) { return d.year; }))
            .range([ 0, width ]);
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3v4.axisBottom(x).ticks(5));

            // Add Y axis
            var y = d3v4.scaleLinear()
            .domain([0, d3v4.max(data, function(d) { return +d.n; })])
            .range([ height, 0 ]);
            svg.append("g")
            .call(d3v4.axisLeft(y));

            // color palette
            var res = sumstat.map(function(d){ return d.key }) // list of group names
            var color = d3v4.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

            // Draw the line
            svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
                .attr("fill", "none")
                .attr("stroke", function(d){ return color(d.key) })
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                return d3v4.line()
                    .x(function(d) { return x(d.year); })
                    .y(function(d) { return y(+d.n); })
                    (d.values)
                })

            })

        }

        setupD3JS3() {

            d3v5.csv("assets/data/data3.csv").then(d => chart(d))

            function chart(data) {

                var keys = data.columns.slice(1);

                var parseTime = d3v5.timeParse("%Y%m%d"),
                    formatDate = d3v5.timeFormat("%Y-%m-%d"),
                    bisectDate = d3v5.bisector(d => d.date).left,
                    formatValue = d3v5.format(",.0f");

                data.forEach(function(d) {
                    d.date = parseTime(d.date);
                    return d;
                })

                var svg = d3v5.select("#chart"),
                    margin = {top: 15, right: 35, bottom: 15, left: 35},
                    width = +svg.attr("width") - margin.left - margin.right,
                    height = +svg.attr("height") - margin.top - margin.bottom;

                var x = d3v5.scaleTime()
                    .rangeRound([margin.left, width - margin.right])
                    .domain(d3v5.extent(data, d => d.date))

                var y = d3v5.scaleLinear()
                    .rangeRound([height - margin.bottom, margin.top]);

                var z = d3v5.scaleOrdinal(d3v5.schemeCategory10);

                var line = d3v5.line()
                    .curve(d3v5.curveCardinal)
                    .x(d => x(d.date))
                    .y(d => y(d.degrees));

                svg.append("g")
                    .attr("class","x-axis")
                    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                    .call(d3v5.axisBottom(x).tickFormat(d3v5.timeFormat("%b")));

                svg.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + margin.left + ",0)");

                var focus = svg.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                focus.append("line").attr("class", "lineHover")
                    .style("stroke", "#999")
                    .attr("stroke-width", 1)
                    .style("shape-rendering", "crispEdges")
                    .style("opacity", 0.5)
                    .attr("y1", -height)
                    .attr("y2",0);

                focus.append("text").attr("class", "lineHoverDate")
                    .attr("text-anchor", "middle")
                    .attr("font-size", 12);

                var overlay = svg.append("rect")
                    .attr("class", "overlay")
                    .attr("x", margin.left)
                    .attr("width", width - margin.right - margin.left)
                    .attr("height", height)

                update(d3v5.select('#selectbox').property('value'), 0);

                function update(input, speed) {

                    var copy = keys.filter(f => f.includes(input))

                    var cities = copy.map(function(id) {
                        return {
                            id: id,
                            values: data.map(d => {return {date: d.date, degrees: +d[id]}})
                        };
                    });

                    y.domain([
                        d3v5.min(cities, d => d3v5.min(d.values, c => c.degrees)),
                        d3v5.max(cities, d => d3v5.max(d.values, c => c.degrees))
                    ]).nice();

                    svg.selectAll(".y-axis").transition()
                        .duration(speed)
                        .call(d3v5.axisLeft(y).tickSize(-width + margin.right + margin.left))

                    var city = svg.selectAll(".cities")
                        .data(cities);

                    city.exit().remove();

                    city.enter().insert("g", ".focus").append("path")
                        .attr("class", "line cities")
                        .style("stroke", d => z(d.id))
                        .merge(city)
                    .transition().duration(speed)
                        .attr("d", d => line(d.values))

                    tooltip(copy);
                }

                function tooltip(copy) {
                    
                    var labels = focus.selectAll(".lineHoverText")
                        .data(copy)

                    labels.enter().append("text")
                        .attr("class", "lineHoverText")
                        .style("fill", d => z(d))
                        .attr("text-anchor", "start")
                        .attr("font-size",12)
                        .attr("dy", (_, i) => 1 + i * 2 + "em")
                        .merge(labels);

                    var circles = focus.selectAll(".hoverCircle")
                        .data(copy)

                    circles.enter().append("circle")
                        .attr("class", "hoverCircle")
                        .style("fill", d => z(d))
                        .attr("r", 2.5)
                        .merge(circles);

                    svg.selectAll(".overlay")
                        .on("mouseover", function() { focus.style("display", null); })
                        .on("mouseout", function() { focus.style("display", "none"); })
                        .on("mousemove", mousemove);

                    function mousemove() {

                        var x0 = x.invert(d3v5.mouse(this)[0]),
                            i = bisectDate(data, x0, 1),
                            d0 = data[i - 1],
                            d1 = data[i],
                            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                        focus.select(".lineHover")
                            .attr("transform", "translate(" + x(d.date) + "," + height + ")");

                        focus.select(".lineHoverDate")
                            .attr("transform", 
                                "translate(" + x(d.date) + "," + (height + margin.bottom) + ")")
                            .text(formatDate(d.date));

                        focus.selectAll(".hoverCircle")
                            .attr("cy", e => y(d[e]))
                            .attr("cx", x(d.date));

                        focus.selectAll(".lineHoverText")
                            .attr("transform", 
                                "translate(" + (x(d.date)) + "," + height / 2.5 + ")")
                            .text(e => e + " " + "º" + formatValue(d[e]));

                        x(d.date) > (width - width / 4) 
                            ? focus.selectAll("text.lineHoverText")
                                .attr("text-anchor", "end")
                                .attr("dx", -10)
                            : focus.selectAll("text.lineHoverText")
                                .attr("text-anchor", "start")
                                .attr("dx", 10)
                    }
                }

                var selectbox = d3v5.select("#selectbox")
                    .on("change", function() {
                        update(this.value, 750);
                    })
            }

        }

    }

        // Initialization

        let general = new General();

});