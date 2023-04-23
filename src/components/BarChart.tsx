import { ResponsiveBar } from "@nivo/bar";
import { useState, useEffect } from "react";

const data = [
  {
    country: "AD",
    "hot dog": 170,
    "hot dogColor": "hsl(120, 70%, 50%)",
    score: 10,
    scoreColor: "hsl(245, 70%, 50%)",
    sandwich: 101,
    sandwichColor: "hsl(2, 70%, 50%)",
    kebab: 88,
    kebabColor: "hsl(261, 70%, 50%)",
    fries: 189,
    friesColor: "hsl(56, 70%, 50%)",
    donut: 172,
    donutColor: "hsl(131, 70%, 50%)",
  },
  {
    country: "AE",
    "hot dog": 196,
    "hot dogColor": "hsl(62, 70%, 50%)",
    score: 136,
    scoreColor: "hsl(235, 70%, 50%)",
    sandwich: 34,
    sandwichColor: "hsl(111, 70%, 50%)",
    kebab: 4,
    kebabColor: "hsl(308, 70%, 50%)",
    fries: 158,
    friesColor: "hsl(289, 70%, 50%)",
    donut: 173,
    donutColor: "hsl(119, 70%, 50%)",
  },
  {
    country: "AF",
    "hot dog": 54,
    "hot dogColor": "hsl(293, 70%, 50%)",
    score: 125,
    scoreColor: "hsl(198, 70%, 50%)",
    sandwich: 32,
    sandwichColor: "hsl(358, 70%, 50%)",
    kebab: 195,
    kebabColor: "hsl(135, 70%, 50%)",
    fries: 173,
    friesColor: "hsl(101, 70%, 50%)",
    donut: 172,
    donutColor: "hsl(241, 70%, 50%)",
  },
  {
    country: "AG",
    "hot dog": 24,
    "hot dogColor": "hsl(158, 70%, 50%)",
    score: 4,
    scoreColor: "hsl(327, 70%, 50%)",
    sandwich: 32,
    sandwichColor: "hsl(356, 70%, 50%)",
    kebab: 128,
    kebabColor: "hsl(136, 70%, 50%)",
    fries: 116,
    friesColor: "hsl(288, 70%, 50%)",
    donut: 107,
    donutColor: "hsl(207, 70%, 50%)",
  },
  {
    country: "AI",
    "hot dog": 139,
    "hot dogColor": "hsl(21, 70%, 50%)",
    score: 144,
    scoreColor: "hsl(43, 70%, 50%)",
    sandwich: 32,
    sandwichColor: "hsl(327, 70%, 50%)",
    kebab: 66,
    kebabColor: "hsl(141, 70%, 50%)",
    fries: 74,
    friesColor: "hsl(64, 70%, 50%)",
    donut: 140,
    donutColor: "hsl(290, 70%, 50%)",
  },
  {
    country: "AL",
    "hot dog": 120,
    "hot dogColor": "hsl(278, 70%, 50%)",
    score: 172,
    scoreColor: "hsl(187, 70%, 50%)",
    sandwich: 171,
    sandwichColor: "hsl(338, 70%, 50%)",
    kebab: 166,
    kebabColor: "hsl(241, 70%, 50%)",
    fries: 145,
    friesColor: "hsl(52, 70%, 50%)",
    donut: 10,
    donutColor: "hsl(302, 70%, 50%)",
  },
  {
    country: "AM",
    "hot dog": 169,
    "hot dogColor": "hsl(84, 70%, 50%)",
    score: 128,
    scoreColor: "hsl(85, 70%, 50%)",
    sandwich: 181,
    sandwichColor: "hsl(167, 70%, 50%)",
    kebab: 178,
    kebabColor: "hsl(132, 70%, 50%)",
    fries: 88,
    friesColor: "hsl(297, 70%, 50%)",
    donut: 162,
    donutColor: "hsl(76, 70%, 50%)",
  },
];

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
