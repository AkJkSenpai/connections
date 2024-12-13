import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // Example data
  const initialData = [
    { text: 'Apple', category: 'Fruits' },
    { text: 'Banana', category: 'Fruits' },
    { text: 'Carrot', category: 'Vegetables' },
    { text: 'Tomato', category: 'Vegetables' },
    { text: 'Dog', category: 'Animals' },
    { text: 'Cat', category: 'Animals' },
    { text: 'Rose', category: 'Flowers' },
    { text: 'Tulip', category: 'Flowers' },
    { text: 'Orange', category: 'Fruits' },
    { text: 'Lettuce', category: 'Vegetables' },
    { text: 'Lion', category: 'Animals' },
    { text: 'Daisy', category: 'Flowers' },
    { text: 'Strawberry', category: 'Fruits' },
    { text: 'Cucumber', category: 'Vegetables' },
    { text: 'Elephant', category: 'Animals' },
    { text: 'Orchid', category: 'Flowers' }
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

  const maxMistakes = 4;

  const categoryColors = {
    Fruits: '#FFD700', // Yellow
    Vegetables: '#90EE90', // Green
    Animals: '#ADD8E6', // Light Blue
    Flowers: '#DDA0DD', // Purple
  };

  const handleItemClick = (index) => {
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
    if (mistakes >= maxMistakes) {
      setMessage('Game over! You have used all your tries.');
      return;
    }

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
        setMessage('You are one away from completing a group!');
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
    const shuffled = shuffleArray(items).map((item) => ({ ...item, selected: false }));
    setItems(shuffled);
    setSelectedItems([]);
    setMessage('');
  };

  return (
    <div className="app">
      <h1>Connections Game</h1>
      <div className="completed-groups">
        {completedGroups.map((group, index) => (
          <div
            key={index}
            className="completed-group"
            style={{ backgroundColor: categoryColors[group.category] }}
          >
            {group.category} group completed: {group.words.join(', ')}
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
              {item.text}
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
