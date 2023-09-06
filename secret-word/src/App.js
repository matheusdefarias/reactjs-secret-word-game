// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import {wordsList} from './data/words';

// Components
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import Game from './components/Game';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedCategory, setPickedCategory] = useState("");
  const [pickedWord, setPickedWord] = useState("");
  const [letters, setLetters] = useState([]);

  const pickWordAndCategory = () => {
    // Pick a random category
    const categories = Object.keys(words);
    let categoryRandomIndex = Math.floor(Math.random() * Object.keys(categories).length);
    const category = categories[categoryRandomIndex];

    // Pick a random word
    let wordRandomIndex = Math.floor(Math.random() * words[category].length);
    const word = words[category][wordRandomIndex];
    
    return {category, word};
  }

  // Starts the Scret Word Game
  const startGame = () => {
    const {category, word} = pickWordAndCategory();
    
    //Create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((letter) => letter.toLowerCase());
    
    // Fill states
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);
    
    
    setGameStage(stages[1].name);
    
  }
  
  console.log(pickedCategory, pickedWord, letters);
  
  // Process the letter input
  const verifyLetter = () => {
    setGameStage(stages[2].name);
  }

  // Restarts the game
  const retry = () => {
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter}/>}
      {gameStage === 'end' && <GameOver retry={retry}/>}
    </div>
  );
}

export default App;
