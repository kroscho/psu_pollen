import React from 'react';
import ItemService from '../../API/ItemService';
import CardItem from '../../components/Card/Card';
import CardAuthor from '../../components/Card/CardAuthor';

export const TypeSearch = { 
    BooksByName: 1, 
    ArticleByName: 2, 
    WebByName: 3, 
    BooksByTheme: 4, 
    ArticleByTheme: 5, 
    WebByTheme: 6, 
    AuthorByName: 7, 
    AuthorByTheme: 8, 
    AllByName: 9, 
    AllByTheme: 10, 
    ActualData: 11,
    BooksByDate: 12,
    ArticleByDate: 13,
    WebByDate: 14,
    Default: 15
};
  
export const getResponse = async (typeSearch, limit, page, searchValue, themes, services, year) => {
    
    function isYear(item, index, array) {
        if (item['id'] === Number(year)) {
            return item['name']
        }
    }
    year = Number(services.Years.find(isYear)['name'])

    let response;
    if (typeSearch === TypeSearch.BooksByName) {
        response = await ItemService.getBooksByName(limit, page, searchValue);
    }
    else if (typeSearch === TypeSearch.ArticleByName) {
        response = await ItemService.getArticlesByName(limit, page, searchValue);
    }
    else if (typeSearch === TypeSearch.WebByName) {
        response = await ItemService.getSitesByName(limit, page, searchValue); 
    }
    else if (typeSearch === TypeSearch.AuthorByName) {
        response = await ItemService.getAuthorsByName(limit, page, searchValue);
    }
    else if (typeSearch === TypeSearch.BooksByTheme) {
        response = await ItemService.getBooksByTheme(limit, page, services.Themes[themes-1].name);
    }
    else if (typeSearch === TypeSearch.ArticleByTheme) {
        response = await ItemService.getArticlesByTheme(limit, page, services.Themes[themes-1].name);
    }
    else if (typeSearch === TypeSearch.WebByTheme) {
        response = await ItemService.getSitesByTheme(limit, page, services.Themes[themes-1].name); 
    }
    else if (typeSearch === TypeSearch.AuthorByTheme) {
        response = await ItemService.getAuthorsByTheme(limit, page, services.Themes[themes-1].name);       
    }
    else if (typeSearch === TypeSearch.ActualData) {
        response = await ItemService.getActualData(limit, page);       
    }
    else if (typeSearch === TypeSearch.BooksByDate) {
        response = await ItemService.getBooksByDatePublished(limit, page, year);       
    }
    else if (typeSearch === TypeSearch.ArticleByDate) {
        response = await ItemService.getArticleByDatePublished(limit, page, year);       
    }
    else if (typeSearch === TypeSearch.WebByDate) {
        response = await ItemService.getWebByDatePublished(limit, page, year);       
    }
    else {
        response = await ItemService.getArticlesByTheme(limit, page, services.Themes[themes-1].name);
    }
    return response;
}

export const getTypeSearchChangeDate = (resource) => {
    let typeSrch;
    switch (resource) {
        case "1": 
            typeSrch = TypeSearch.BooksByDate;
            break;
        case "2":
            typeSrch = TypeSearch.ArticleByDate;
            break;
        case "3":
            typeSrch = TypeSearch.WebByDate;
            break;
        default:
            typeSrch = TypeSearch.BooksByDate;
            break;
    }
    return typeSrch;
}

export const getTypeSearchChangeActual = (resource) => {
    return TypeSearch.ActualData;
}

export const getTypeSearchChangeName = (resource) => {
    let typeSrch;
    switch (resource) {
        case "1": 
            typeSrch = TypeSearch.BooksByName;
            break;
        case "2":
            typeSrch = TypeSearch.ArticleByName;
            break;
        case "3":
            typeSrch = TypeSearch.WebByName;
            break;
        case "4":
            typeSrch = TypeSearch.AuthorByName;
            break;
        case "5": 
            typeSrch = TypeSearch.AllByName;
            break;
        default:
            typeSrch = TypeSearch.AllByTheme;
            break;
    }
    return typeSrch;
}

export const getTypeSearchChangeTheme = (resource) => {
    let typeSrch;
    switch (resource) {
        case "1": 
            typeSrch = TypeSearch.BooksByTheme;
            break;
        case "2":
            typeSrch = TypeSearch.ArticleByTheme;
            break;
        case "3":
            typeSrch = TypeSearch.WebByTheme;
            break;
        case "4":
            typeSrch = TypeSearch.AuthorByTheme;
            break;
        case "5": 
            typeSrch = TypeSearch.AllByTheme;
            break;
        default:
            typeSrch = TypeSearch.AllByTheme;
            break;
    }
    return typeSrch;
}

export const getTitlePage = (searchValue, resourse, page, total, typeSearch, totalPages, themes) => {
    let resourceText;
    themes.forEach((elem) => {
        if (elem.id === resourse.toString()) {
            resourceText = elem.name;
            return;
        }
    })
    let text;
    if (typeSearch !== TypeSearch.ActualData) {
        text = `Результаты поиска по запросу <<${searchValue}>>, ${resourceText}. \nСтраница: ${page}, Всего страниц: ${totalPages}, Всего найдено: ${total}`
    }
    else {
        text = `Актуальные данные за последние 3 дня. Всего страниц: ${totalPages}, Всего найдено: ${total}`
    }
    return text;
}

export const listResources = (resources) => resources.map((item) => {
    return (
        <option value={item.id} key={item.id}>{item.name}</option>
    )
})

export const cardsItems = (data, typeSearch) => data.map((item, index) => {
    if (typeSearch === TypeSearch.AuthorByName || typeSearch === TypeSearch.AuthorByTheme) {
        return (
            <CardAuthor data={item} key={index}></CardAuthor>
        )
    }
    else {
        return (
            <CardItem data={item} key={index}></CardItem>
        )
    }
})