import React, { useEffect } from 'react';
import './graph.css';
import * as d3 from "d3";
import axios from 'axios';

const Scatter = (props) => {
    useEffect(() => {
        const data = props.data;

        const minDate = new Date(Math.min.apply(null, data.map(function(e) {
            return new Date(e.start_date);
        })));
        const maxDate = new Date(Math.max.apply(null, data.map(function(e) {
            return new Date(e.start_date);
        })));
        data.forEach(element => {
            element['duration'] = Math.round((new Date(element.finish_date).getTime() - new Date(element.start_date).getTime())/(1000*365.25*24*60*60))
            element['startDateInYears'] = new Date(element.start_date)
        });
        const height = 500,
        width = 1500,
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

        const fastestTime = d3.min(data, (d) => {
            return d.duration;
        });

        const xScale = d3
            .scaleLinear()
            .range([width, 0])
            .domain([
                d3.max(data, (d) => {
                    return d.duration;
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
                return xScale(d.duration);
            })
            .attr("cy", (d) => {
                return yScale(d.startDateInYears);
            })
            .style("fill", (d) => {
                return myColor(d.duration)
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
        }
        var mousemove = function(d) {
            Tooltip
                .html("<strong>Name: </strong>"+d.name+
                    "<br/><strong>Time as Justice: </strong>"+d.duration+" years"+
                    "<br/><strong>"+props.xLabel+": </strong>"+d.startDateInYears.toDateString())
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
            .text("...");

        chart
            .append("text")
            .style("font-size", "14px")
            .style("text-anchor", "middle")
            .attr("class", "yLabel")
            .attr("transform", "translate(" + height + ", 0)")
            .attr("x", height / -2)
            .attr("y", -30)
            .attr("transform", "rotate(-90)")
            .text("...");

        d3.select(".xLabel").text(props.xLabel);
        d3.select(".yLabel").text(props.yLabel);
    }, [props]);
    
    
    return (
        <div className="graph-container">
          <svg className="chart"></svg>
        </div>
    );
};
 
export default Scatter;