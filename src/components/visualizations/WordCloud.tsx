import React from "react";
import WordCloud from "react-d3-cloud";
import { SentimentResults } from "../../types/sentimentresult";

function prepareForWordCloud(paragraph: string) {
  paragraph = paragraph.toLowerCase(); // Convert to lowercase
  const stopWords = [
    "a",
    "im",
    "i",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "were",
    "will",
    "with",
    // Add more stop words as needed
  ];
  const regex = /[^\w\s]|_/g; // Matches any non-word character except spaces
  const sanitizedParagraph = paragraph.replace(regex, ""); // Remove non-word characters

  const words = sanitizedParagraph.split(/\s+/); // Split the sanitized paragraph by spaces
  const wordss = words.filter((word) => !stopWords.includes(word));
  return wordss;
}

function countWords(arr: any) {
  const wordCount: any = {};

  // Count occurrences of each word
  for (let i = 0; i < arr.length; i++) {
    const word = arr[i];
    if (wordCount[word]) {
      wordCount[word]++;
    } else {
      wordCount[word] = 1;
    }
  }

  // Convert word count object to array of objects
  const result = [];
  for (const word in wordCount) {
    result.push({ text: word, value: wordCount[word] });
  }

  return result;
}

export default function Cloud({ data }: { data: SentimentResults }) {
  console.log(data);

  let text = "";
  data.map((item) => {
    text += item.text + " ";
  });

  console.log(text);

  const result = prepareForWordCloud(text);

  console.log(result);

  const datas = countWords(result);

  console.log(datas);

  // const datas = [
  //   { text: "Hey", value: 1000 },
  //   { text: "lol", value: 200 },
  //   { text: "first impression", value: 800 },
  //   { text: "very cool", value: 100 },
  //   { text: "duck", value: 10 },
  // ];

  const callbacks = {
    getWordColor: (word) => (word.value > 50 ? "blue" : "red"),
    onWordClick: console.log,
    onWordMouseOver: console.log,
    getWordTooltip: (word) =>
      `${word.text} (${word.value}) [${word.value > 50 ? "good" : "bad"}]`,
  };
  
  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
  };
  
  const size = [600, 400];


  return <ReactWordcloud size={size} words={words} />;
  );
}
