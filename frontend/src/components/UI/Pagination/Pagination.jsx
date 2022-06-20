import React from 'react'
import { getPagesArray } from '../../utils/pages';

const Pagination = ({totalPages, page, changePage}) => {
    
    let pagesArray = getPagesArray(page, totalPages)
    if (totalPages === 0) {
        return (
            <div style={{display:'flex', justifyContent:'center'}}>Ничего не найдено</div>
        )
    }
    else {
        return (
            <div className="page__wrapper">
                {page <= 10 
                    ? <span></span> 
                    : <span 
                        onClick={() => changePage(page-10)}
                        className="page"
                        >
                            &laquo;
                    </span>}
                {page === 1 
                    ? <span></span> 
                    : <span 
                        onClick={() => changePage(page-1)}
                        className="page"
                        >
                            &lt;
                    </span>}
                {pagesArray.map(p => 
                    <span
                        onClick={() => changePage(p)}
                        key={p} 
                        className={page === p ? "page page__current" : "page"}
                    >
                        {p}
                    </span>
                )}
                {page === totalPages 
                    ? <span></span> 
                    : <span 
                        onClick={() => changePage(page+1)}
                        className="page"
                        >
                            &gt;
                    </span>}
                {page > totalPages - 10 
                    ? <span></span> 
                    : <span 
                        onClick={() => changePage(page+10)}
                        className="page"
                        >
                            &raquo;
                    </span>}
            </div>
        )
    }
}

export default Pagination;