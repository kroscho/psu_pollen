from datetime import date
from owlready2 import *

path_dir = (os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(path_dir)

import utils

class Ontology(object):
    def __init__(self, path):
        onto_path.append(path)
        self.path = path
        self.onto = get_ontology(self.path)
        self.onto.load()
        self.onto.save(path)
        self.countNewItems = 0
        
    def create_ontology(self):
        self.onto.load()
        with self.onto:
            class Пользователи(Thing):
                pass

            class Авторы(Thing):
                pass

            class Книги(Thing):
                pass

            class ВебРесурсы(Thing):
                pass

            class Статьи(Thing):
                pass

            class Темы(Thing):
                pass

            class АвторВебРесурса(Авторы >> ВебРесурсы):
                pass

            class ВебРесурсНаписанАвтором(ObjectProperty):
                domain = [ВебРесурсы]
                range = [Авторы]
                inverese_property = АвторВебРесурса

            class ВебРесурсНаписанПро(ВебРесурсы >> Темы):
                pass

            class АвторКниги(Авторы >> Книги):
                pass

            class АвторПисалПро(Авторы >> Темы):
                pass

            class КнигаНаписанаАвтором(ObjectProperty):
                domain = [Книги]
                range = [Авторы]
                inverese_property = АвторКниги

            class КнигаНаписанаПро(Книги >> Темы):
                pass

            class АвторСтатьи(Авторы >> Статьи):
                pass

            class СтатьяНаписанаАвтором(ObjectProperty):
                domain = [Статьи]
                range = [Авторы]
                inverese_property = АвторСтатьи

            class СтатьяНаписанаПро(Статьи >> Темы):
                pass

            class ПользовательИнтересуется(Пользователи >> Темы):
                pass

            class dateArticle(DataProperty, FunctionalProperty):
                domain = [Статьи]
                range = [date]

            class dateBook(DataProperty, FunctionalProperty):
                domain = [Книги]
                range = [date]

            class dateWebResourse(DataProperty, FunctionalProperty):
                domain = [ВебРесурсы]
                range = [date]

            class ratingArticle(Статьи >> int):
                pass

            class ratingBook(Книги >> int):
                pass

            class ratingWebResourse(ВебРесурсы >> int):
                pass

            class urlArticle(DataProperty, FunctionalProperty):
                domain = [Статьи]
                range = [str]

            class urlBook(DataProperty, FunctionalProperty):
                domain = [Книги]
                range = [str]

            class urlWebResourse(DataProperty, FunctionalProperty):
                domain = [ВебРесурсы]
                range = [str]

            class numberOfCitationsBook(Книги >> int):
                pass

            class numberOfCitationsArticle(Статьи >> int):
                pass

            class numberOfCitationsWebResourse(ВебРесурсы >> int):
                pass

            class viewsBook(Книги >> int):
                pass

            class viewsArticle(Статьи >> int):
                pass

            class viewsWebResourse(ВебРесурсы >> int):
                pass

            class dowloadsBook(Книги >> int):
                pass

            class dowloadsArticle(Статьи >> int):
                pass

            class dowloadsWebResourse(ВебРесурсы >> int):
                pass

            class datePublishedBook(Книги >> int):
                pass

            class datePublishedArticle(Статьи >> int):
                pass

            class datePublishedWebResourse(ВебРесурсы >> int):
                pass

            class bookFromResource(DataProperty, FunctionalProperty):
                domain = [Книги]
                range = [str]

            class articleFromResource(DataProperty, FunctionalProperty):
                domain = [Статьи]
                range = [str]

            class webFromResource(DataProperty, FunctionalProperty):
                domain = [ВебРесурсы]
                range = [str]

            class hasName(Пользователи >> str):
                pass

            class hasLastName(Пользователи >> str):
                pass

            class hasLogin(Пользователи >> str):
                pass

            class hasRole(Пользователи >> str):
                pass

            class hasPlaceOfWork(Пользователи >> str):
                pass

            self.onto.save()
            print("Создание онтологии завершено!")

    # запись в онтологию книги или статьи
    def recordingNewItemInOntology(self, resultsList):          
        
        # проверка на существование этой книги или статьи в онтологии
        def checkExistItemInOntology(item):
            existList = self.onto.search(iri = "*" + item)
            if existList == []:
                return False
            self.countNewItems += 1
            return True 

        # делим список на части
        def splitItem(item):
            authors = item.get('author')
            title = item.get('title')
            url = item.get('url')
            type = item.get('type')
            rating = item.get('rating')
            date = item.get('date')
            numberOfCitations = item.get('numberOfCitations')
            views = item.get('views')
            dowloads = item.get('dowloads')
            datePublished = item.get('datePublished')
            theme = item.get('theme')
            resource = item.get('resource')
            return title, authors, url, type, numberOfCitations, views, dowloads, datePublished, theme, rating, date, resource
        
        with self.onto:
            class Авторы(Thing):
                pass
            class Статьи(Thing):
                pass
            class Книги(Thing):
                pass
            class ВебРесурсы(Thing):
                pass
        
        for item in resultsList:
            title, authors, url, type, numberOfCitations, views, dowloads, datePublished, theme, rating, date, resource = splitItem(item)
            existItemInOntology = checkExistItemInOntology(title)
            class_theme = self.onto[theme.replace(" ", "_")]

            if type == utils.typeParseItem.Article.value:                
                for author in authors:    
                    if not existItemInOntology:
                        new_title = Статьи(title.replace(' ', '_'))
                        new_aut = Авторы(author.replace(' ', '_'))
                        new_aut.АвторСтатьи.append(new_title)
                        new_title.СтатьяНаписанаПро.append(class_theme)
                        new_title.СтатьяНаписанаАвтором.append(new_aut)
                        new_title.urlArticle = url
                        new_title.ratingArticle.append(rating)
                        new_title.dateArticle = date
                        new_title.numberOfCitationsArticle.append(numberOfCitations)
                        new_title.viewsArticle.append(views)
                        new_title.dowloadsArticle.append(dowloads)
                        new_title.datePublishedArticle.append(datePublished)
                        new_title.articleFromResource = resource
                    else:
                        try:
                            new_title = Статьи(title.replace(' ', '_'))
                        except Exception:
                            print("Не добавлена статья")
                        else:
                            new_aut = Авторы(author.replace(' ', '_'))
                            new_aut.АвторПисалПро.append(class_theme)
                            try:
                                new_title.СтатьяНаписанаПро.append(class_theme)
                            except Exception:
                                print("ошибка", new_title, "   ", class_theme)
                            else:
                                new_title.numberOfCitationsArticle.append(numberOfCitations)
                                new_title.ratingArticle.append(rating)
                                new_title.viewsArticle.append(views)
                                new_title.dowloadsArticle.append(dowloads)
                                
            elif type == utils.typeParseItem.Book.value: 
                for author in authors:
                    if not existItemInOntology: 
                        new_title = Книги(title.replace(' ', '_'))
                        new_aut = Авторы(author.replace(' ', '_')) 
                        new_aut.АвторКниги.append(new_title)
                        new_title.КнигаНаписанаАвтором.append(new_aut)
                        new_title.КнигаНаписанаПро.append(class_theme)
                        new_title.urlBook = url
                        new_title.ratingBook.append(rating)
                        new_title.dateBook = date
                        new_title.numberOfCitationsArticle.append(numberOfCitations)
                        new_title.viewsBook.append(views)
                        new_title.dowloadsBook.append(dowloads)
                        new_title.datePublishedBook.append(datePublished)
                        new_title.bookFromResource = resource
                    else:
                        try:
                            new_title = Книги(title.replace(' ', '_'))
                        except Exception:
                            print("Не добавлена книга")
                        else:
                            new_aut = Авторы(author.replace(' ', '_'))
                            new_aut.АвторПисалПро.append(class_theme)
                            try:
                                new_title.КнигаНаписанаПро.append(class_theme)
                            except Exception:
                                print("ошибка", new_title, "   ", class_theme)
                            else:
                                new_title.numberOfCitationsBook.append(numberOfCitations)
                                new_title.ratingBook.append(rating)
                                new_title.viewsBook.append(views)
                                new_title.dowloadsBook.append(dowloads)
            
            elif type == utils.typeParseItem.Site.value: 
                if not existItemInOntology: 
                    new_web_resourse = ВебРесурсы(title.replace(' ', '_'))
                    new_web_resourse.СайтНаписанПро.append(class_theme)
                    new_web_resourse.urlWebResourse = url
                    new_web_resourse.ratingWebResourse.append(rating)
                    new_web_resourse.dateWebResourse = date
                    new_title.numberOfCitationsArticle.append(numberOfCitations)
                    new_title.viewsArticle.append(views)
                    new_title.dowloadsArticle.append(dowloads)
                    new_title.datePublishedArticle.append(datePublished)
                    new_title.webFromResource = resource
                else:
                    try:
                        new_web_resourse = ВебРесурсы(title.replace(' ', '_'))
                    except Exception:
                        print("Не добавлен сайт")
                    else:
                        try:
                            new_web_resourse.СайтНаписанПро.append(class_theme)
                        except Exception:
                            print("ошибка: ", new_web_resourse)
                        else: 
                            new_web_resourse.ratingWebResourse.append(rating)

        print("Добавлено новых: ", self.countNewItems)
        self.onto.save(self.path) 
            
            
