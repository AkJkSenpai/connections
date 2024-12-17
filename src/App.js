import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // Example data
  const initialData = [
    { text: 'TZOUKKI TZOUKKI', category: 'SANONTOJA' },
    { text: 'CHILLISTI', category: 'SANONTOJA' },
    { text: 'GLUG GLUG VITTU', category: 'SANONTOJA' },
    { text: 'TIMEII', category: 'SANONTOJA' },
    { text: 'KORTSU', category: 'KÄMPPÄAPPROT' },
    { text: 'TINDER', category: 'KÄMPPÄAPPROT' },
    { text: 'KAHOOT', category: 'KÄMPPÄAPPROT' },
    { text: 'GIN TONIC', category: 'KÄMPPÄAPPROT' },
    { text: 'TARRA', category: 'DRAAMA' },
    { text: 'VESINOKKA- ELÄIN', category: 'DRAAMA' },
    { text: 'DILDOBINGO', category: 'DRAAMA' },
    { text: 'SOMETIIMI', category: 'DRAAMA' },
    { text: 'BABBY', category: 'INSIDEJUTUT' },
    { text: 'TUOPPI', category: 'INSIDEJUTUT' },
    { text: '👁️👁️', category: 'INSIDEJUTUT' },
    { text: 'Orchid', category: 'INSIDEJUTUT' }
  ];

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [items, setItems] = useState(
    shuffleArray(initialData.map((item) => ({ ...item, selected: false, hidden: false })))
  );
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState('');
  const [completedGroups, setCompletedGroups] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const maxMistakes = 4;

  const categoryColors = {
    SANONTOJA: '#FFD700', // Yellow
    KÄMPPÄAPPROT: '#90EE90', // Green
    DRAAMA: '#ADD8E6', // Light Blue
    INSIDEJUTUT: '#DDA0DD', // Purple
  };

  useEffect(() => {
    if (completedGroups.length === 4) {
      setGameWon(true);
      setMessage('Congratulations! You completed all groups!');
    }
  }, [completedGroups]);

  useEffect(() => {
    if (mistakes >= maxMistakes) {
      setGameOver(true);
      setMessage('Game over! You have used all your tries.');
    }
  }, [mistakes]);

  const handleItemClick = (index) => {
    if (gameOver || gameWon) return;

    if (selectedItems.length < 4 || items[index].selected) {
      const newItems = [...items];
      const item = newItems[index];

      // Toggle selection
      if (item.selected) {
        setSelectedItems(selectedItems.filter((i) => i !== index));
      } else {
        setSelectedItems([...selectedItems, index]);
      }

      newItems[index].selected = !item.selected;
      setItems(newItems);
    } else {
      setMessage('You can only select up to 4 items at a time.');
    }
  };

  const checkCategories = () => {
    if (gameOver || gameWon) return;

    const selected = selectedItems.map((i) => items[i]);
    const categories = selected.map((item) => item.category);
    const uniqueCategories = [...new Set(categories)];

    if (uniqueCategories.length === 1 && selected.length === 4) {
      // Correct group
      setMessage('Correct! All items belong to the same category.');
      setCompletedGroups([
        ...completedGroups,
        { category: uniqueCategories[0], words: selected.map((item) => item.text) },
      ]);
      setItems((prev) =>
        prev.map((item, index) =>
          selectedItems.includes(index) ? { ...item, hidden: true, selected: false } : item
        )
      );
      setSelectedItems([]);
    } else if (selected.length === 4) {
      // "One away" feedback
      const countByCategory = categories.reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      if (Object.values(countByCategory).includes(3)) {
        setMistakes((prev) => {
          const newMistakes = prev + 1;
          if (newMistakes >= maxMistakes) {
            setMessage('Game over! You have used all your tries.');
            setSelectedItems([]);
          } else {
            setMessage('You are one away from completing a group!');
          }
          return newMistakes;
        });
      } else {
        setMistakes((prev) => {
          const newMistakes = prev + 1;
          if (newMistakes >= maxMistakes) {
            setMessage('Game over! You have used all your tries.');
            setSelectedItems([]);
          } else {
            setMessage('Incorrect selection. Try again!');
          }
          return newMistakes;
        });
      }
    } else {
      setMistakes((prev) => {
        const newMistakes = prev + 1;
        if (newMistakes >= maxMistakes) {
          setMessage('Game over! You have used all your tries.');
          setSelectedItems([]);
        } else {
          setMessage('Incorrect selection. Try again!');
        }
        return newMistakes;
      });
    }
  };

  const shuffleItems = () => {
    if (gameOver || gameWon) return;

    const shuffled = shuffleArray(items).map((item) => ({ ...item, selected: false }));
    setItems(shuffled);
    setSelectedItems([]);
    setMessage('');
  };

  return (
    <div className="app">
      <h1>Connections Game</h1>
      {gameWon && <div className="win-box">You Win! 🎉</div>}
      {gameOver && <div className="lose-box">Game Over! 😢</div>}
      <div className="completed-groups">
        {completedGroups.map((group, index) => (
          <div
            key={index}
            className="completed-group"
            style={{ backgroundColor: categoryColors[group.category] }}
          >
            <span className="category-name">{group.category}</span> <br></br> {group.words.join(', ')}
          </div>
        ))}
      </div>
      <div className="mistakes">
        Mistakes remaining:
        {[...Array(Math.max(0, maxMistakes - mistakes))].map((_, index) => (
          <span key={index} className="mistake-dot"></span>
        ))}
      </div>
      <div className="grid">
        {items.map((item, index) => (
          !item.hidden && (
            <div
              key={index}
              className={`item ${item.selected ? 'selected' : ''}`}
              onClick={() => handleItemClick(index)}
            >
              <span className="item-text">{item.text}</span>
            </div>
          )
        ))}
      </div>
      <div className="button-container">
        <button className="submit-button" onClick={checkCategories}>Submit</button>
        <button className="shuffle-button" onClick={shuffleItems}>Shuffle</button>
      </div>
      <p className="message">{message}</p>
    </div>
  );
};

export default App;
