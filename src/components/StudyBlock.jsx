import { useState, useEffect } from 'react';

export default function StudyBlock(props) {
    const [filterMode, setFilterMode] = useState('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFront, setIsFront] = useState(true);

    useEffect(function() {
        setCurrentIndex(0);
        setIsFront(true);
    }, [props.activeFlashcards]);

    function handleModeChange(e) {
        setFilterMode(e.target.value);
        setCurrentIndex(0);
        setIsFront(true);
    }

    function turnCard() {
        setIsFront(!isFront);
    }

    function goBack() {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFront(true);
        }
    }

    function onMixClick() {
        props.mixCards();
        setCurrentIndex(0);
        setIsFront(true);
    }

    let displayArr = [];
    for (let i = 0; i < props.activeFlashcards.length; i++) {
        if (filterMode === 'all') {
            displayArr.push(props.activeFlashcards[i]);
        } else if (props.activeFlashcards[i].learned === false) {
            displayArr.push(props.activeFlashcards[i]);
        }
    }

    let safeIndex = currentIndex;
    if (currentIndex >= displayArr.length) {
        safeIndex = 0;
    }
    
    let targetCard = displayArr[safeIndex];

    function goForward() {
        if (currentIndex < displayArr.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFront(true);
        }
    }

    return (
        <section>
            <h2>Режим обучения</h2>
            <select value={filterMode} onChange={handleModeChange}>
                <option value="all">Все карточки</option>
                <option value="unlearned">Только невыученные</option>
            </select>
            <button onClick={onMixClick}>Перемешать</button>

            <div className="card" onClick={turnCard}>
                {!targetCard ? "Нет карточек" : (isFront === true ? targetCard.front : targetCard.back)}
            </div>

            <div className="nav-buttons">
                <button onClick={goBack} disabled={safeIndex === 0 || !targetCard}>Назад</button>
                <p style={{ margin: 0, alignSelf: 'center', fontWeight: 'bold' }}>
                    {displayArr.length === 0 ? "" : `Карточка ${safeIndex + 1} из ${displayArr.length}`}
                </p>
                <button onClick={goForward} disabled={safeIndex >= displayArr.length - 1 || !targetCard}>Вперед</button>
            </div>
        </section>
    );
}