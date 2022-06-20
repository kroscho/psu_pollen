import {makeAutoObservable} from 'mobx';

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user1 = {
            userObj: "пользователь1",
            firstName: "Никита",
            lastName: "Гришин",
            email: "nike04@mail.ru",
            role: "admin",
            uid: "Ey0mfGCJ4kSVCNEZa2KzPGM8BYn1",
        }
        this._user = {}
        this._allCourses = []
        this._myCourses = []
        this._curCourse = {}
        this._curTest = {}
        this._curAttempt = {}
        this._curAttempts = []
        this._curVariant = {}
        this._curModule = {}
        this._curLecture = {}
        this._cartAmount = 0
        this._curNewUser = {}
        this._curNewCourse = {}
        this._curEditAttempt = {}
        this._curQuestion = {}
        this._curFieldKey = 0
        this._uid = ""
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }

    setCurNewUser(newUser) {
        this._curNewUser = newUser
    }

    setCurNewCourse(newCourse) {
        this._curNewCourse = newCourse
    }

    setCurEditAttempt(attempt) {
        this._curEditAttempt = attempt
    }

    setAllCourses(item) {
        this._allCourses[this._allCourses.length] = item
    }

    setMyCourses(item) {
        //this._myCourses[this._myCourses.length] = item
        this._myCourses = item
    }

    deleteMyCourse(item) {
        this._myCourses = this._myCourses.filter(elem => elem.id !== item.id)
    }

    setCurCourse(item) {
        this._curCourse = item
    }

    setCurLecture(item) {
        this._curLecture = item
    }

    setCurTest(item) {
        this._curTest = item
    }

    setLectures(item) {
        this._myCourses[0].modules[0].lectures[this._myCourses[0].modules[0].lectures.length] = item
    }

    setCurModule(item) {
        this._curModule = item
    }

    setCurVariant(item) {
        this._curVariant = item
    }

    setCurAttempt(item) {
        this._curAttempt = item
    }

    setUID(uid) {
        this._uid = uid
    }

    setCurAttempts(attempts) {
        this._curAttempts = attempts
    }

    setCurQuestion(text) {
        this._curQuestion = text
    }

    setCurFieldKey(key) {
        this._curFieldKey = key
    }

    get isAuth() {
        return this._isAuth
    }
    get User() {
        return this._user
    }

    get AllCourses() {
        return this._allCourses
    }

    get MyCourses() {
        return this._myCourses
    }

    get CurCourse() {
        return this._curCourse
    }

    get CurTest() {
        return this._curTest
    }

    get CurLecture() {
        return this._curLecture
    }

    get CurModule() {
        return this._curModule
    }

    get CurVariant() {
        return this._curVariant
    }

    get CurAttempt() {
        return this._curAttempt
    }

    get CurNewUser() {
        return this._curNewUser
    }

    get CurNewCourse() {
        return this._curNewCourse
    }

    get CurUID() {
        return this._uid
    }

    get CurAttempts() {
        return this._curAttempts
    }

    get CurEditAttempt() {
        return this._curEditAttempt
    }

    get CurQuestion() {
        return this._curQuestion
    }

    get СurFieldKey() {
        return this._curFieldKey
    }

}