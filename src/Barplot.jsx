
import React from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { countryContinent, countryFlag } from "./countryData";


const Barplot = ({ data, width = 600, barHeight = 24, barGap = 8 }) => {
  // Group data by continent (vertical stacking)
  // Group data by continent (vertical stacking)
  const continents = Array.from(
    new Set(data.map((d) => countryContinent[d.country] || "Other"))
  );
  // Prepare grouped data
  const grouped = continents.map((cont) => ({
    continent: cont,
    countries: data.filter((d) => (countryContinent[d.country] || "Other") === cont),
  }));

  // Calculate total chart height
  const sectionHeights = grouped.map(
    (g) => g.countries.length * (barHeight + barGap) + 32 // 32px for section label
  );
  const chartHeight = sectionHeights.reduce((a, b) => a + b, 0);
  const labelWidth = 140;
  const barMaxWidth = width - labelWidth - 32;

  // Find global max for x scale
  const xMax = Math.max(...data.map((d) => d.students));
  const xScale = scaleLinear()
    .domain([0, xMax])
    .range([0, barMaxWidth]);

  let yOffset = 0;
  return (
    <svg width={width} height={chartHeight}>
      {grouped.map((group, gi) => {
        // y scale for this group
        const yScale = scaleBand()
          .domain(group.countries.map((d) => d.country))
          .range([0, group.countries.length * (barHeight + barGap)])
          .paddingInner(barGap / (barHeight + barGap));
        const sectionY = yOffset;
        yOffset += group.countries.length * (barHeight + barGap) + 32;
        return (
          <g key={group.continent} transform={`translate(0, ${sectionY})`}>
            <text
              x={0}
              y={20}
              fontSize={18}
              fontWeight="bold"
              fill="#222"
            >
              {group.continent}
            </text>
            {group.countries.map((d) => {
              const y = yScale(d.country) + 32; // 32px for section label
              const barW = xScale(d.students);
              return (
                <g key={d.country} transform={`translate(0, ${y})`}>
                  <text
                    x={0}
                    y={barHeight / 2 +1}
                    alignmentBaseline="middle"
                    fontSize={14}
                    fill="#333"
                  >
                    {countryFlag[d.country] ? `${countryFlag[d.country]} ` : "🏳️ "}{d.country}
                  </text>
                  <rect
                    x={labelWidth}
                    y={0}
                    width={barW}
                    height={barHeight}
                    fill="#4e79a7"
                    rx={4}
                  />
                  <text
                    x={labelWidth + barW + 8}
                    y={barHeight / 2 +5}
                    alignmentBaseline="middle"
                    fontSize={18}
                    fontWeight="bold"
                    fill="#222"
                  >
                    {d.students}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default Barplot;
