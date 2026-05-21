import TableRow from './TableRow';

export default function CardsTable(props) {
    return (
        <section>
            <h2>Все карточки</h2>
            <table>
                <thead>
                    <tr>
                        <th>Вопрос</th>
                        <th>Ответ</th>
                        <th>Отметить</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {props.activeFlashcards.map(function(itm) {
                        return (
                            <TableRow 
                                key={itm.id} 
                                item={itm} 
                                onToggle={props.markLearned} 
                                onDelete={props.removeCard} 
                                onEdit={props.editCard} 
                            />
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}