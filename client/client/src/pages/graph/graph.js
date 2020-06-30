import React, { useState, useEffect } from 'react';
import { colorDataString } from '../../data/dash.js';
import './graph.css';
import * as d3 from "d3";

const Scatter = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // setIsLoading(true);
        d3.selectAll("svg > *").remove();
        const data = props.data;

        const minDate = new Date(Math.min.apply(null, data.map(function(e) {
            return new Date(Object.keys(e)[0]);
        })));
        const maxDate = new Date(Math.max.apply(null, data.map(function(e) {
            return new Date(Object.keys(e)[0]);
        })));
        const height = 500,
        width = 1000,
        margins = { top: 20, right: 100, bottom: 70, left: 50 };
        var myColor = d3.scaleLinear().domain([1, data.length/2])
            .range(["skyblue", "darkblue"])

        const chart = d3
            .select(".chart")
            .attr("width", width + margins.left + margins.right)
            .attr("height", height + margins.top + margins.bottom)
            .append("g")
            .attr(
            "transform",
            "translate(" + margins.left + "," + margins.top + ")"
            );

        const xScale = d3
            .scaleLinear()
            .range([width, 0])
            .domain([
                d3.max(data, (d) => {
                    return Object.values(d)[0][0];
                }),
                0
            ]);

        const yScale = d3.scaleTime()
            .range([0, height])
            .domain([maxDate, minDate])

        const dots = chart
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("transform", "translate(20, 0)")
            .attr("cx", (d) => {
                return xScale(Object.values(d)[0][0]);
            })
            .attr("cy", (d) => {
                return yScale(new Date(Object.keys(d)[0]));
            })
            .style("fill", (d) => {
                let color = colorDataString[props.colorIndex][Object.values(d)[0][props.colorIndex]];
                return props.colorIndex ? color : myColor(Object.values(d)[0][0]);
            })
            .attr('fill-opacity', 1);

        const Tooltip = d3
            .select(".graph-container")
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
                .select("#tipDiv")
                .append("svg")
        }
        var mousemove = function(d) {
            Tooltip
                .html("<strong>Date: </strong>"+new Date(Object.keys(d)[0])+
                "</br><strong>Value: </strong>"+Object.values(d)[0][0]+
                "</br><strong>"+props.colorActive+": </strong>"+Object.values(d)[0][props.colorIndex])
                .style("left", (d3.mouse(this)[0]+70) + "px")
                .style("top", (d3.mouse(this)[1]+470) + "px")
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

        dots
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        chart
            .append("g")
            .attr("transform", "translate(20," + height + ")")
            .call(d3.axisBottom(xScale));

        chart.append("g")
            .attr("transform", "translate(20,0)")
            .call(d3.axisLeft(yScale));
            
        chart
            .append("text")
            .style("font-size", "14px")
            .style("text-anchor", "middle")
            .attr("class", "xLabel")
            .attr("x", width / 2)
            .attr("y", height + 50)
            .text("");

        chart
            .append("text")
            .style("font-size", "14px")
            .style("text-anchor", "middle")
            .attr("class", "yLabel")
            .attr("transform", "translate(" + height + ", 0)")
            .attr("x", height / -2)
            .attr("y", -30)
            .attr("transform", "rotate(-90)")
            .text("");

        d3.select(".xLabel").text(props.xLabel);
        d3.select(".yLabel").text(props.yLabel);

        // LEGEND
        var Svg = d3.select("#legend")
        let keys = Object.keys(colorDataString[props.colorIndex])
        // Add one dot in the legend for each name.
        Svg.selectAll("mydots")
            .data(keys)
            .enter()
            .append("circle")
            .attr("cx", 100)
            .attr("cy", function(d,i){ return 100 + i*25})
            .attr("r", 7)
            .style("fill", function(d){ return colorDataString[props.colorIndex][d]})

        // Add one dot in the legend for each name.
        Svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 120)
            .attr("y", function(d,i){ return 100 + i*25}) 
            .style("fill", function(d){ return colorDataString[props.colorIndex][d]})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        // setIsLoading(false);
    }, [props]);
    
    
    return (
        <div className="graph-container">
            <svg className="chart"></svg>
            <svg id="legend"></svg>
        </div>
    );
};
 
export default Scatter;