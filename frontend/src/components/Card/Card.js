import React from 'react';

import './Card.css';

const CardItem = ({data}) => {
    const listThemes = data.themes.map((theme, index) => {
        return (
            <li className='card__li' key={index}>{theme}</li>
        )
    })

    const listAuthors = data.authors.map((author, index) => {
        return (
            <li className='card__li' key={index}>{author}</li>
        )
    })
    
    return (
        <div className="card">
            <h3><a href={data?.url} target="_blank">{data?.title}</a></h3>
            <span> <b>Авторы:</b></span> 
            <ul className="card__ul"> {listAuthors} </ul> 
            <span><b>Ключевые слова:</b></span> 
            <ul className="card__ul"> {listThemes} </ul>
            <span><b>Информация:</b></span>
            <div className='card__info'>
                <span>Цитирований: {data?.citations}</span>
                <span>Скачиваний: {data?.dowloads}</span>
                <span>Просмотров: {data?.views}</span>
                <span>Дата публикации: {data?.datePublished}</span>
                <span>Источник: {data?.resourse}</span>
            </div>
            <a href={data?.url} target="_blank">Подробнее</a>
        </div>
    )
}

export default CardItem;