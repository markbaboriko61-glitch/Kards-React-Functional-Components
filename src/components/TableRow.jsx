import { memo } from 'react';

function TableRow(props) {
    return (
        <tr>
            <td>{props.item.front}</td>
            <td>{props.item.back}</td>
            <td>
                <input 
                    type="checkbox" 
                    checked={props.item.learned} 
                    onChange={function() { props.onToggle(props.item.id) }} 
                />
            </td>
            <td>
                <button onClick={function() { props.onEdit(props.item.id) }}>Ред.</button>
                <button style={{ marginLeft: '5px' }} onClick={function() { props.onDelete(props.item.id) }}>Удалить</button>
            </td>
        </tr>
    );
}

export default memo(TableRow);