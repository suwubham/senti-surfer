import React from "react";
import ReactWordcloud from "react-wordcloud";
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
      wordCount[word] += 200;
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
  let text = "";
  data.map((item) => {
    text += item.text + " ";
  });

  const result = prepareForWordCloud(text);

  const datas = countWords(result);

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
  };

  const size = [450, 400];

  return (
    <ReactWordcloud
      //@ts-ignore
      options={options}
      //@ts-ignore
      size={size}
      words={datas.sort((a, b) => b.value - a.value).slice(0, 500)}
    />
  );
}
