import { useEffect, useState } from "react";
import { scaleLinear } from "d3-scale";
import { SentimentResults } from "../../types/sentimentresult";
import { LocationData, toolTip } from "../../types/choropleth";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";
import worldata from "./worlddata.json";

const colorScale = scaleLinear<string>()
  .domain([0, 50, 100])
  .range(["#ff6666", "#f2e6d9", "#00b359"]);

export default function Map({ data }: { data: SentimentResults }) {
  const [tooltip, setTooltip] = useState<toolTip | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [locationdata, setLocationdata] = useState<LocationData[]>([]);

  const handleMouseMove = (toolTip: toolTip, evt: any) => {
    setTooltip(toolTip);
    setTooltipPosition({ x: evt.clientX, y: evt.clientY });
  };

  useEffect(() => {
    setLocationdata(formatdata(data));
  }, []);

  return (
    <>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
      >
        <ZoomableGroup zoom={1}>
          <Sphere
            id="sphere1"
            fill="#ffffff"
            stroke="#E4E5E6"
            strokeWidth={0.5}
          />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          {locationdata.length > 0 && (
            <Geographies geography={worldata}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = locationdata.find((s: any) => {
                    return s["Country"] === geo.id;
                  });
                  const color = d ? colorScale(d["Score"]) : "#F5F4F6";
                  const toolTip: toolTip = {
                    name: geo.properties.name,
                    score: d?.Score,
                    color: color,
                  };
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseMove={(event) => {
                        handleMouseMove(toolTip, event);
                      }}
                      onMouseLeave={() => {
                        setTooltip(null);
                      }}
                      style={{
                        default: {
                          fill: d ? color : "#F5F4F6",
                          stroke: "#AAA",
                        },
                        hover: {
                          fill: d ? color : "#F5F4F6",
                          stroke: "#fff000",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="bg-gray-100 text-gray-900 p-2 rounded-md shadow-md flex justify-between items-center gap-3"
          style={{
            position: "absolute",
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
          }}
        >
          {tooltip.score ? (
            <div
              className="w-7 h-7 rounded-full"
              style={{ backgroundColor: tooltip.color }}
            ></div>
          ) : null}

          <div>
            <p className="font-bold text-lg">{tooltip.name}</p>
            <p className="text-gray-400">
              {tooltip.score ? Math.round(tooltip.score) : "Data not available"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

const formatdata = (data: SentimentResults): LocationData[] => {
  const locationdata: { [key: string]: number[] } = {};
  data.map((comment) => {
    if (comment["location"] != "Null") {
      const location = comment["location"];
      if (location in locationdata) {
        locationdata[location].push(comment["compound"]);
      } else {
        locationdata[location] = [comment.compound];
      }
    }
  });
  const scoreByLocaiton: LocationData[] = [];
  for (const [country, score] of Object.entries(locationdata)) {
    const avgScore = score.reduce((a, b) => a + b) / score.length;
    const data = { Country: country, Score: avgScore };
    scoreByLocaiton.push(data);
  }
  return scoreByLocaiton;
};
