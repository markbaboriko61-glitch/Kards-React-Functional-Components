import { useState, useEffect, useCallback } from 'react';
import DeckSelect from './components/DeckSelect';
import AddCard from './components/AddCard';
import CardsTable from './components/CardsTable';
import StudyBlock from './components/StudyBlock';
import './App.css';

function decodeStr(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

function App() {
    const [allDecks, setAllDecks] = useState([]);
    const [activeDeck, setActiveDeck] = useState(0);
    const [newDeckStr, setNewDeckStr] = useState('');
    const [frontInput, setFrontInput] = useState('');
    const [backInput, setBackInput] = useState('');

    useEffect(function() {
        const localData = localStorage.getItem('friend_flashcards');
        let parsedData = [];
        
        if (localData !== null) {
            try {
                parsedData = JSON.parse(localData);
            } catch (e) {
                parsedData = [];
            }
        }

        let hasCards = false;
        if (parsedData.length > 0) {
            if (parsedData[0].flashcards && parsedData[0].flashcards.length > 0) {
                hasCards = true;
            }
        }

        if (hasCards === true) {
            setAllDecks(parsedData);
        } else {
            fetch('https://opentdb.com/api.php?amount=50')
                .then(function(res) {
                    return res.json();
                })
                .then(function(data) {
                    if (data.results) {
                        let fetchedCards = [];
                        for(let i = 0; i < data.results.length; i++) {
                            fetchedCards.push({
                                id: Date.now() + i,
                                front: decodeStr(data.results[i].question),
                                back: decodeStr(data.results[i].correct_answer),
                                learned: false
                            });
                        }
                        setAllDecks([{ groupName: "Основная колода", flashcards: fetchedCards }]);
                    } else {
                        setAllDecks([{ groupName: "Основная колода", flashcards: [] }]);
                    }
                })
                .catch(function(error) {
                    setAllDecks([{ groupName: "Основная колода", flashcards: [] }]);
                });
        }
    }, []);

    useEffect(function() {
        const interval = setInterval(function() {
            setAllDecks(function(prevDecks) {
                if (prevDecks.length > 0) {
                    localStorage.setItem('friend_flashcards', JSON.stringify(prevDecks));
                }
                return prevDecks;
            });
        }, 5000);
        
        return function() {
            clearInterval(interval);
        };
    }, []);

    function updateNewDeckName(e) {
        setNewDeckStr(e.target.value);
    }

    function updateFront(e) {
        setFrontInput(e.target.value);
    }

    function updateBack(e) {
        setBackInput(e.target.value);
    }

    function createNewDeck() {
        let txt = newDeckStr.trim();
        if (txt === '') return;
        
        let newDeck = { groupName: txt, flashcards: [] };
        let newDecksArray = [];
        for (let i = 0; i < allDecks.length; i++) {
            newDecksArray.push(allDecks[i]);
        }
        newDecksArray.push(newDeck);
        
        setAllDecks(newDecksArray);
        setNewDeckStr('');
        setActiveDeck(newDecksArray.length - 1);
    }

    function selectDeck(e) {
        setActiveDeck(Number(e.target.value));
    }

    function pushCard() {
        if (frontInput === '' || backInput === '') return;
        const newCardObj = { id: Date.now(), front: frontInput, back: backInput, learned: false };
        
        setAllDecks(function(prev) {
            return prev.map(function(deck, idx) {
                if (idx === activeDeck) {
                    let updatedFlashcards = [];
                    for (let i = 0; i < deck.flashcards.length; i++) {
                        updatedFlashcards.push(deck.flashcards[i]);
                    }
                    updatedFlashcards.push(newCardObj);
                    return { ...deck, flashcards: updatedFlashcards };
                }
                return deck;
            });
        });
        setFrontInput('');
        setBackInput('');
    }

    const markLearned = useCallback(function(cardId) {
        setAllDecks(function(prev) {
            return prev.map(function(deck, idx) {
                if (idx === activeDeck) {
                    let newFlashcards = deck.flashcards.map(function(c) {
                        if (c.id === cardId) {
                            return { ...c, learned: !c.learned };
                        }
                        return c;
                    });
                    return { ...deck, flashcards: newFlashcards };
                }
                return deck;
            });
        });
    }, [activeDeck]);

    const removeCard = useCallback(function(cardId) {
        setAllDecks(function(prev) {
            return prev.map(function(deck, idx) {
                if (idx === activeDeck) {
                    let filtered = deck.flashcards.filter(function(c) {
                        return c.id !== cardId;
                    });
                    return { ...deck, flashcards: filtered };
                }
                return deck;
            });
        });
    }, [activeDeck]);

    const editCard = useCallback(function(cardId) {
        setAllDecks(function(prev) {
            const currentDeck = prev[activeDeck];
            let cardToEdit = null;
            
            for (let i = 0; i < currentDeck.flashcards.length; i++) {
                if (currentDeck.flashcards[i].id === cardId) {
                    cardToEdit = currentDeck.flashcards[i];
                    break;
                }
            }
            
            if (cardToEdit !== null) {
                setFrontInput(cardToEdit.front);
                setBackInput(cardToEdit.back);
                
                return prev.map(function(deck, idx) {
                    if (idx === activeDeck) {
                        let filtered = deck.flashcards.filter(function(c) {
                            return c.id !== cardId;
                        });
                        return { ...deck, flashcards: filtered };
                    }
                    return deck;
                });
            }
            return prev;
        });
    }, [activeDeck]);

    function mixCards() {
        setAllDecks(function(prev) {
            return prev.map(function(deck, idx) {
                if (idx === activeDeck) {
                    let mixed = [];
                    for (let i = 0; i < deck.flashcards.length; i++) {
                        mixed.push(deck.flashcards[i]);
                    }
                    mixed.sort(function() {
                        return Math.random() - 0.5;
                    });
                    return { ...deck, flashcards: mixed };
                }
                return deck;
            });
        });
    }

    let activeFlashcards = [];
    if (allDecks.length > 0 && allDecks[activeDeck]) {
        activeFlashcards = allDecks[activeDeck].flashcards;
    }

    return (
        <div className="container">
            <h1>Flashcards</h1>

            <DeckSelect 
                allDecks={allDecks} 
                activeDeck={activeDeck} 
                selectDeck={selectDeck} 
                newDeckStr={newDeckStr} 
                updateNewDeckName={updateNewDeckName} 
                createNewDeck={createNewDeck} 
            />

            <AddCard 
                frontInput={frontInput} 
                backInput={backInput} 
                updateFront={updateFront} 
                updateBack={updateBack} 
                pushCard={pushCard} 
            />

            <CardsTable 
                activeFlashcards={activeFlashcards} 
                markLearned={markLearned} 
                removeCard={removeCard} 
                editCard={editCard} 
            />

            <StudyBlock 
                activeFlashcards={activeFlashcards} 
                mixCards={mixCards} 
            />
        </div>
    );
}

export default App;