import { ResponsiveBar } from "@nivo/bar";
import { useState, useEffect } from "react";

export default (props: any) => {
  const [count, setCount] = useState<any>();
  useEffect(() => {
    const senti_count: any = {
      Positive: 0,
      Negative: 0,
      Neutral: 0,
    };
    Object.values(props.test).map((value) => {
      // @ts-ignore
      value.sentiment != "Compund" ? (senti_count[value.sentiment] += 1) : null;
    });

    const data = Object.entries(senti_count).map(([sentiment, count]) => ({
      sentiment,
      count,
    }));
    setCount(data);
  }, [props.test]);

  return (
    <>
      <ResponsiveBar
        data={count}
        keys={["count"]}
        indexBy="sentiment"
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        padding={0.3}
        colors={{ scheme: "accent" }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate={true}
        // @ts-ignore
        motionStiffness={90}
        motionDamping={15}
        tooltip={({ indexValue, value }) => (
          <div>
            <div>{indexValue}</div>
            <div>{value}</div>
          </div>
        )}
      />
    </>
  );
};
