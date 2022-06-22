import history from "../../services/history"
import { TESTING_ALL_COURSES_ROUTE, TESTING_COURSES_ROUTE, TESTING_ROUTE } from "../../utils/consts"

export const isMenuCourses = () => {
    return  history.location.pathname === TESTING_ROUTE || history.location.pathname === TESTING_COURSES_ROUTE ||
        history.location.pathname === TESTING_ALL_COURSES_ROUTE
} 

export const isAdmin = (user) => {
    return user.role === "admin"; 
}

export function deepEqual(obj1, obj2){
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export const getWordAnswer = (index) => {
    const listWords = ["a)", "b)", "c)", "d)", "e)", "f)", "g)", "h)", "i)", "j)", "k)", "l)"]
    return listWords[index]
}

export const setLocalStorage = (key, item) => {
    localStorage.setItem(key, JSON.stringify(item))
} 

export const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
} 