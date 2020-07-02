import React, { useState, useEffect } from 'react';
import { colorDataString } from '../../data/dash.js';
import './cascade.css';
import axios from 'axios';
import * as d3 from "d3";

const Cascade = (props) => {
    let [graphData, setGraphData] = useState([])
    let [maxDate, setmaxDate] = useState()
    let [minDate, setminDate] = useState()
    useEffect(() => {
        const data = props.data;
        data.splice(0, 1)
        let filterData = data.map(a => a.fields);
        filterData = filterData.filter(a => a.dateArgument && a.dateArgument !== "0" && a.dateDecision && a.dateDecision !== "0");
        filterData = filterData.splice(0, 40);
        const filterStartDate = filterData.map(a => new Date(a.dateArgument));
        const filterEndDate = filterData.map(a => new Date(a.dateDecision));
        const dateRange = [...filterStartDate, ...filterEndDate]
        const maxDate=new Date(Math.max.apply(null,dateRange));
        const minDate=new Date(Math.min.apply(null,dateRange));
        maxDate.setMonth(maxDate.getMonth() + 2);
        setmaxDate(maxDate)
        minDate.setMonth(minDate.getMonth() - 2);
        setminDate(minDate)
        setGraphData(filterData)
    }, [props.data])

    useEffect(() => {
        d3.selectAll(".cascade-graph-container > .justice > svg").remove();
        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        
        // Get the data
        var data = graphData;
        let dataLength = data.length;
        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(".justice")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // scale the range of the data
        x.domain([minDate, maxDate]).tickFormat(d3.timeFormat('%B'));
        y.domain([-1, dataLength]);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        // add the X Axis
        var gX = svg.append("g")
            .attr("transform", "translate(" + margin.left + ", " + (margin.top + height) + ")")
            .call(xAxis);

        // add the Y Axis
        var gY = svg.append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(yAxis);

        // Zoom functionality
        var zoom = d3.zoom()
            .scaleExtent([0.5, 20])
            .extent([[0, 0], [width, dataLength]])
            .on("zoom", zoomed);

        var points_g = svg.append("g")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr("clip-path", "url(#clip)");
            // .classed("points_g", true);

        const Tooltip = d3
            .select(".cascade-graph-container")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("cursor", "pointer")
            .style("position", "absolute")

        var mouseover = function(d) {
            Tooltip
                .style("opacity", 1)
                .style("display", "block")
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
                .style("cursor", "pointer")
                .select("#tipDiv")
                .append("svg")
        }
        var mousemove = function(d, idx) {
            Tooltip
                .html("<strong>Case Id: </strong>"+d.caseId+
                "</br><strong>Docket Id: </strong>"+d.docketId+
                "</br><strong>Justice: </strong>"+d.chief+
                "</br><strong>Start Date: </strong>"+d.dateArgument+
                "</br><strong>End Date: </strong>"+d.dateDecision+
                "</br><strong>Majority Votes: </strong>"+d.majVotes+
                "</br><strong>Minority Votes: </strong>"+d.minVotes)
                .style("left", (d3.mouse(this)[0]+300) + "px")
                .style("top", (d3.mouse(this)[1]+1270) + "px")
                .style("display", "block")
        }
        var mouseleave = function(d) {
            Tooltip
                .style("opacity", 0)
                .style("display", "none");
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1)
        }

        // add the dots
        var startdots = points_g.selectAll("startdots")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 7)
            .attr("cx", (d) => { 
                return x(new Date(d.dateArgument)); 
            })
            .attr("cy", (d, idx) => { 
                return y((idx)); 
            })
            .style("fill", (d) => {
                return "green"
            })
            .attr('fill-opacity', 1);;

        const enddots = points_g
            .selectAll("enddots")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 7)
            .attr("transform", "translate(0, 0)")
            .attr("cx", (d) => {
                return x(new Date(d.dateDecision));
            })
            .attr("cy", (d, idx) => {
                return y(idx);
            })
            .style("fill", (d) => {
                return "red";
            })
            .attr('fill-opacity', 1);
        
        const line = points_g
            .selectAll("line")
            .data(data)
            .enter()
            .append("line") // attach a line
            .style("stroke", "black")  // colour the line
            .attr("x1",(d, idx) => {
                return x(new Date(d.dateArgument));
            })     // x position of the first end of the line
            .attr("y1", (d, idx) => {
                return y(idx);
            })      // y position of the first end of the line
            .attr("x2", (d, idx) => {
                return x(new Date(d.dateDecision));
            })     // x position of the second end of the line
            .attr("y2", (d, idx) => {
                return y(idx);
            });

        
        startdots
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        enddots
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
 
        function zoomed() {
            var new_x = d3.event.transform.rescaleX(x);
            var new_y = d3.event.transform.rescaleY(y);
            // update axes
            gX.call(xAxis.scale(new_x));
            gY.call(yAxis.scale(new_y));
            startdots.data(data)
                .attr('cx', function(d) {return new_x(new Date(d.dateArgument))})
                .attr('cy', function(d, idx) {return new_y((idx)); });

            enddots.data(data)
                .attr('cx', function(d) {return new_x(new Date(d.dateDecision))})
                .attr('cy', function(d, idx) {return new_y((idx)); });

            line.data(data)
                .attr("x1",(d, idx) => {
                    return new_x(new Date(d.dateArgument));
                })     // x position of the first end of the line
                .attr("y1", (d, idx) => {
                    return new_y(idx);
                })      // y position of the first end of the line
                .attr("x2", (d, idx) => {
                    return new_x(new Date(d.dateDecision));
                })     // x position of the second end of the line
                .attr("y2", (d, idx) => {
                    return new_y(idx);
                });
        }
        
    }, [graphData]);
    
    
    return (
        <div className="cascade-graph-container">
            <div className="justice"></div>
        </div>
    );
};
 
export default Cascade;