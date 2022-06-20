import React, {useState, useContext, useEffect} from 'react';
import {InputGroup} from 'react-bootstrap';
import { Context } from '../../index';
import Pagination from '../../components/UI/Pagination/Pagination';
import './Search.css';
import Loader from '../../components/UI/Loader/Loader';
import { useFetching } from '../../components/hooks/useFetching';
import { getNumberSearchPage, getPageCount } from '../../components/utils/pages';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';
import { cardsItems, getResponse, getTitlePage, TypeSearch, listResources, getTypeSearchChangeName, getTypeSearchChangeTheme, getTypeSearchChangeDate, getTypeSearchChangeActual } from './utils';


const Search = (props) => {

    const [resource, setResource] = useState("1");
    const [year, setYear] = useState("1");
    const [themes, setThemes] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const {services} = useContext(Context)
    const [totalPages, setTotalPages] = useState(0)
    const limit = 10;
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    const [click, setClick] = useState(true)
    const [typeSearch, setTypeSearch] = useState(TypeSearch.ActualData)
    const [totalCountItems, setTotalCountItems] = useState(0)
    const [searchPages, setSearchPages] = useState([])

    const [fetchItems, isDataLoading, itemsError] = useFetching(async () => {
        if (searchPages.indexOf(getNumberSearchPage(page)) === -1) {
            let response = await getResponse(typeSearch, limit, getNumberSearchPage(page), searchValue, themes, services, year)
            setSearchPages(getNumberSearchPage(page))
            setSearchPages(searchPages.concat(getNumberSearchPage(page)))
            services.setItems(response.data)
            setData(services.Items.slice((page-1)*limit, page*limit))
            setTotalCountItems(response['x-total-count'])
            setTotalPages(getPageCount(response['x-total-count'], limit))
        }
        else {
            setData(services.Items.slice((page-1)*limit, page*limit))
        }
    })

    const changeTypeSearch = (e) => {
        e.preventDefault()
        const idChange = e.target.id;
        setSearchPages([])
        services.setItems([])
        let typeSrch;
        if (idChange === "name") {
            typeSrch = getTypeSearchChangeName(resource)
        }
        else if (idChange === "theme") {
            typeSrch = getTypeSearchChangeTheme(resource)
        }
        else if (idChange === "year") {
            typeSrch = getTypeSearchChangeDate(resource)
        }
        else if (idChange === "actual") {
            typeSrch = getTypeSearchChangeActual(resource)
        }
        setTypeSearch(typeSrch)
        setData([])
        setPage(1)
        setClick(!click)
    }

    const changePage = (p) => {
        setPage(p)
    }

    useEffect(() => {
        fetchItems()
    }, [page, click])

    return (
        <div className="contain">
            <div>
                <div className="block-left">
                    <h2>Фильтры</h2>
                    <h3>Тип ресурса</h3>
                    <select 
                        style={{width: '30%', height:'30px', border: '1px solid #000000'}}
                        value={resource} 
                        onChange={(e) => setResource(e.target.value)}
                    >
                        {listResources(services.Resources)}
                    </select>
                    <h3>Поиск по названию</h3>
                    <InputGroup className="mb-3">
                        <input
                            style={{width:'70%', height:'30px', border: '1px solid #000000'}}
                            placeholder=""
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            type="text"
                        />                        
                        <button className="st-button" onClick={changeTypeSearch} id={"name"}>Поиск</button>
                    </InputGroup>
                    <h3>Поиск по ключевым словам</h3>
                    <InputGroup className="mb-3">
                        <select 
                            style={{width:'70%', height:'30px', border: '1px solid #000000'}}
                            value={themes} 
                            onChange={(event) => setThemes(event.target.value)}
                        >
                            {listResources(services.Themes)}
                        </select>
                        <button className="st-button" onClick={changeTypeSearch} id={"theme"}>Поиск</button>
                    </InputGroup>
                    <h3>Поиск по дате публикации</h3>
                    <OverlayTrigger
                        placement='right'
                        overlay={
                            <Tooltip id={`tooltip-right`}>
                            Покажутся данные, опубликованные позже выбранной даты.
                            </Tooltip>
                        }
                        >
                        <InputGroup className="mb-3">
                            <select 
                                style={{width: '30%', height:'30px', border: '1px solid #000000'}}
                                value={year} 
                                onChange={(e) => setYear(e.target.value)}
                            >
                            {listResources(services.Years)}
                            </select>
                            <button className="st-button" onClick={changeTypeSearch} id={"year"}>Поиск</button>
                        </InputGroup>
                    </OverlayTrigger>
                    <h3>Актуальные данные за 3 дня</h3>
                    <InputGroup className="mb-3">                        
                        <button className="st-button" onClick={changeTypeSearch} id={"actual"}>Показать</button>
                    </InputGroup>
                </div>
                <div className="block-right">
                    {isDataLoading
                        ?""
                        :<h2>{getTitlePage(searchValue, resource, page, totalCountItems, typeSearch, totalPages, services.Resources)}</h2>
                    }
                    {isDataLoading 
                        ? <div style={{display:'flex', justifyContent:'center'}}><Loader></Loader></div>
                        : data
                            ? cardsItems(data, typeSearch)
                            :  <div style={{display:'flex', justifyContent:'center'}}>Данные не найдены</div>
                        
                    }
                    {isDataLoading
                        ? <div></div>
                        : <Pagination 
                            totalPages={totalPages} 
                            changePage={changePage} 
                            page={page}
                        ></Pagination>
                    }
                </div>
            </div>
        </div>
    )
}

export default Search;