import React from 'react';

import './Card.css';

const CardAuthor = ({data}) => {
    const listThemes = data.themes.map((theme, index) => {
        return (
            <li className='card__li' key={index}>{theme}</li>
        )
    })

    const listItems = data.items.map((item, index) => {
        return (
            <li className='card__li' key={index}><a href={item.url[0]} target="_blank">{item.title}</a></li>
        )
    })
    
    return (
        <div className="card">
            <h3>{data?.author}</h3>
            <span> <b>Публикации:</b></span> 
            <ul className="card__ul"> {listItems} </ul> 
            <span><b>Ключевые слова:</b></span> 
            <ul className="card__ul"> {listThemes} </ul>
            <span><b>Индекс Хирша:</b> {data?.index_hirsch}</span> 
        </div>
    )
}

export default CardAuthor;