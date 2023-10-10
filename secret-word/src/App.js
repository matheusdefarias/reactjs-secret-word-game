import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { wordsList, categoriesType } from "./data/words";
import { StartScreen } from "./components/StartScreen";
import { GameOver } from "./components/GameOver";
import { Game } from "./components/Game";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedCategory, setPickedCategory] = useState("");
  const [pickedWord, setPickedWord] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words);
    let categoryRandomIndex = Math.floor(
      Math.random() * Object.keys(categories).length
    );
    const category = categories[categoryRandomIndex];

    // Pick a random word
    let wordRandomIndex = Math.floor(Math.random() * words[category].length);
    const word = words[category][wordRandomIndex];

    const categoryPort = categoriesType[category];

    return { categoryPort, word };
  }, [words]);

  // Starts the Scret Word Game
  const startGame = useCallback(() => {
    // Clear all letters
    clearLettersStates();

    // Choose a word
    const { categoryPort, word } = pickWordAndCategory();

    //Create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((letter) => letter.toLowerCase());

    // Fill states
    setPickedCategory(categoryPort);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // Process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // Push guessed letter or remove a chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // Check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // Reset all states
      clearLettersStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // Check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // Win condition
    if (
      guessedLetters.length === uniqueLetters.length &&
      gameStage === stages[1].name
    ) {
      // Add score
      setScore((actualScore) => (actualScore += 100));

      // Restart game with new word
      startGame();
    }
  }, [guessedLetters, letters, gameStage, startGame]);

  // Restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
