import React, { useEffect } from 'react';
import './graph.css';
import * as d3 from "d3";
import axios from 'axios';

const Scatter = (props) => {

    
    
    useEffect(() => {
        const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

        axios.get(url).then((res) => {
            const data = res.data;
            console.log(data)
            const height = 500,
            width = 1500,
            margins = { top: 20, right: 100, bottom: 50, left: 50 };

            const chart = d3
                .select(".chart")
                .attr("width", width + margins.left + margins.right)
                .attr("height", height + margins.top + margins.bottom)
                .append("g")
                .attr(
                "transform",
                "translate(" + margins.left + "," + margins.top + ")"
                )
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

            const fastestTime = d3.min(data, (d) => {
                return d.Seconds;
            });

            const xScale = d3
                .scaleLinear()
                .range([width, 0])
                .domain([
                    0,
                    d3.max(data, (d) => {
                        return d.Seconds - fastestTime;
                    }) + 5
                ]);

            const yScale = d3
                .scaleLinear()
                .range([0, height])
                .domain([1, data.length + 1]);

            const dots = chart
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("cx", (d) => {
                    return xScale(d.Seconds - fastestTime);
                })
                .attr("cy", (d) => {
                    return yScale(d.Place);
                })
                .style("fill", (d) => {
                    if (d.Doping) {
                        return "indianred";
                    } else {
                        return "lightgrey";
                    }
                });

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
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            }
            var mousemove = function(d) {
                Tooltip
                    .html(d.Name+
                        "<br/>"+d.Nationality+
                        "<br/>"+d.Doping+
                        "<br/>"+d.Year)
                    .style("left", (d3.mouse(this)[0]+70) + "px")
                    .style("top", (d3.mouse(this)[1]+400) + "px")
            }
            var mouseleave = function(d) {
                Tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            }
            dots
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
            

            chart
                .selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text((d) => {
                return d.Name;
                })
                .attr("x", (d) => {
                return xScale(d.Seconds - fastestTime);
                })
                .attr("y", (d) => {
                return yScale(d.Place);
                })
                .attr("transform", "translate(10,5)");

            chart
                .append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

            chart.append("g").call(d3.axisLeft(yScale));

            chart
                .append("text")
                .style("font-size", "14px")
                .style("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", height + 50)
                .text("Seconds Behind Fastest Time");

            chart
                .append("text")
                .style("font-size", "14px")
                .style("text-anchor", "middle")
                .attr("x", height / -2)
                .attr("y", -30)
                .attr("transform", "rotate(-90)")
                .text("Ranking");
        });
    }, []);
    
    
    return (
        <div className="graph-container">
          <svg className="chart"></svg>
        </div>
    );
};
 
export default Scatter;