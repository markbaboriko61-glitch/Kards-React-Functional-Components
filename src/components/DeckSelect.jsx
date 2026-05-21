export default function DeckSelect(props) {
    return (
        <section>
            <h2>Управление колодами</h2>
            <select value={props.activeDeck} onChange={props.selectDeck} style={{marginBottom: '10px'}}>
                {props.allDecks.map(function(elem, index) {
                    return <option key={index} value={index}>{elem.groupName}</option>;
                })}
            </select>
            <input value={props.newDeckStr} onChange={props.updateNewDeckName} placeholder="Название новой колоды" />
            <button onClick={props.createNewDeck}>Создать колоду</button>
        </section>
    );
}