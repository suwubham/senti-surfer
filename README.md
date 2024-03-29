# Senti-Surfer : A Bilingual Approach to Sentiment Analysis for Social Media

Senti-Surfer is a research project developed by 4th-semester CS students at Kathmandu University, Dhulikhel, as part of our COMP 207 course. The project aims to create a web extension for sentiment analysis of bilingual social media content to gain useful insights from the data.

## Getting Started

**Prerequisites**

> Have Node and Anaconda installed in your computer.

**Installation**

Clone the project

```bash
  git clone https://github.com/suwubham/Senti-Surfer
```

Go to the project directory and install dependencies

```bash
  cd Senti-Surfer
  npm install
```

Create a .env file and add Google and MongoDB API key. Your env file should look like this:

```bash
  YTAPI_KEY = your_api_key
  MONGODB_URI = your_api_key
```

> [Instructions to obtain API key 🗝️](https://developers.google.com/youtube/v3/getting-started)

Build the project

```bash
  npm run build
```

Go to server directory and install dependencies

```bash
  cd server
  pip install requirements.txt
```

## Usage

    1. Open extension settings in your web browser and activate developer mode.

    2. Click on "Load unpacked" to load the dist folder located in the project directory.

    3. Go to server directory and start server

        > uvicorn server:app --reload

## Documentation

[Project Proposal](https://docs.google.com/document/d/1GOC7XxknxBl4_4kPFoMYAeulTjMmAgpyL3zbbdn-Jc8/edit?usp=sharing)

## Authors

- [@Shubham Shakya](https://www.github.com/suwubham)
- [@Saral Sainju](https://github.com/prg6useless)
- [@Subham Shrestha](https://github.com/subhamshr)
- [@Nisham Ghimire](https://github.com/nishamghimire5)
