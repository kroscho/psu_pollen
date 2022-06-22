import {makeAutoObservable} from 'mobx';
import { ADD_ROUTE, ALLERGENS_ROUTE, COURSE_TESTS_TEST_ROUTE, COURSE_TESTS_TEST_VARIANTS_ROUTE, ARCHIVE_ROUTE, COURSE_INFO_ROUTE, COURSE_LECTIONS_ROUTE, COURSE_LITERATURE_ROUTE, COURSE_TESTS_ROUTE, MAIN_ROUTE, PROFILE_ROUTE, SEARCH_ROUTE, TESTING_ALL_COURSES_ROUTE, TESTING_COURSES_ROUTE, TESTING_ROUTE, VIEW_ROUTE, COURSE_LECTURE_ROUTE, TESTS_TEST_ATTEMPT_ROUTE, TESTS_TEST_ATTEMPTS_DETAILS_ROUTE, TESTS_TEST_CHECK_WORKS_ROUTE, COURSE_TERMS_ROUTE, COURSE_ONTOLOGY_ROUTE } from '../utils/consts';

export default class UserStore {
    constructor() {
        this._themes = [
            { id: "1", name: 'палинология' },
            { id: "2", name: 'palynology' },
            { id: "3", name: 'пыльцевые зерна' },
            { id: "4", name: 'pollen grains' },
        ]

        this._resource = [
            { id: "1", name: 'Книги' },
            { id: "2", name: 'Статьи' },
            { id: "3", name: 'Сайты' },
            { id: "4", name: 'Авторы' },
        ]

        this._menuTesting = [
            { id: "1", name: 'Мои курсы', link: TESTING_COURSES_ROUTE },
            { id: "2", name: 'Все курсы', link: TESTING_ALL_COURSES_ROUTE },
        ]

        this._menuCourse = [
            { id: "1", name: 'Информация', link: COURSE_INFO_ROUTE },
            { id: "2", name: 'Материалы', link: COURSE_LECTIONS_ROUTE },
            { id: "3", name: 'Тесты', link: COURSE_TESTS_ROUTE },
            { id: "5", name: 'Концепты', link: COURSE_TERMS_ROUTE },
            { id: "6", name: 'Онтология', link: COURSE_ONTOLOGY_ROUTE },
            { id: "7", name: 'Мои курсы', link: TESTING_COURSES_ROUTE },
            { id: "8", name: 'Все курсы', link: TESTING_ALL_COURSES_ROUTE },
        ]

        this._menuApp = [
            { id: "1", name: 'Главная', link: MAIN_ROUTE },
            { id: "2", name: 'Аллергены', link: ALLERGENS_ROUTE },
            { id: "3", name: 'Добавление', link: ADD_ROUTE },
            { id: "4", name: 'Мониторинг', link: VIEW_ROUTE },
            { id: "5", name: 'Архив', link: ARCHIVE_ROUTE },
            { id: "6", name: 'Поиск', link: SEARCH_ROUTE },
            { id: "7", name: 'Тестирование', link: TESTING_COURSES_ROUTE },
            { id: "8", name: 'Профиль', link: PROFILE_ROUTE },
        ]

        this._routes = {
            "/testing/courses": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: true}
            ],
            "/course/info": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_INFO_ROUTE, title: "Информация о курсе", active: true},
            ],
            "/course/lections": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_LECTIONS_ROUTE, title: "Материалы", active: true},
            ],
            "/course/tests": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_TESTS_ROUTE, title: "Тесты", active: true},
            ],
            "/course/terms": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_TERMS_ROUTE, title: "Концепты", active: true},
            ],
            "/course/ontology": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_TERMS_ROUTE, title: "Онтология", active: true},
            ],
            "/course/tests/test/variants": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_TESTS_ROUTE, title: "Тесты", active: false},
                {path: COURSE_TESTS_TEST_VARIANTS_ROUTE, title: "Тест", active: true},
            ],
            "/course/tests/test/attempt": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_TESTS_ROUTE, title: "Тесты", active: false},
                {path: TESTS_TEST_ATTEMPT_ROUTE, title: "Попытка", active: true},
            ],
            "/course/tests/test/attempts_details": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_TESTS_ROUTE, title: "Тесты", active: false},
                {path: COURSE_TESTS_TEST_VARIANTS_ROUTE, title: "Варианты", active: false},
                {path: TESTS_TEST_ATTEMPTS_DETAILS_ROUTE, title: "Попытки", active: true},
            ],
            "/course/tests/test/check_works": [
                {path: TESTING_COURSES_ROUTE, title: "Мои курсы", active: false}, 
                {path: COURSE_TESTS_ROUTE, title: "Тесты", active: false},
                {path: COURSE_TESTS_TEST_VARIANTS_ROUTE, title: "Тест", active: false},
                {path: TESTS_TEST_CHECK_WORKS_ROUTE, title: "Проверка", active: true},
            ],
        }

        const getListYears = () => {
            let resultList = []
            let j = 1;
            for (let i = 2022; i > 1950; i--) {
                resultList.push({id: j, name: i});
                j++;
            }
            return resultList;
        }

        this._years = getListYears()

        this._items = []

        makeAutoObservable(this)
    }

    setThemes(themes) {
        this._themes = themes
    }

    setResource(resource) {
        this._resource = resource
    }

    setItems(items) {
        if (items.length != 0) {
            this._items = this._items.concat(items)
        }
        else {
            this._items = []
        }
    }

    get MenuTesting() {
        return this._menuTesting
    }

    get MenuCourse() {
        return this._menuCourse
    }

    get MenuApp() {
        return this._menuApp
    }

    get Years() {
        return this._years
    }

    get Resources() {
        return this._resource
    }

    get Themes() {
        return this._themes
    }

    get Items() {
        return this._items
    }

    get Routes() {
        return this._routes
    }
}