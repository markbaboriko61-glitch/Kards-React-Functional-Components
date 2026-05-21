export default function AddCard(props) {
    return (
        <section>
            <h2>Добавить карточку</h2>
            <input value={props.frontInput} onChange={props.updateFront} placeholder="Вопрос или термин" />
            <input value={props.backInput} onChange={props.updateBack} placeholder="Ответ или определение" />
            <button onClick={props.pushCard}>Добавить карточку</button>
        </section>
    );
}