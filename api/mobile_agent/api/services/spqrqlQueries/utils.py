import os, sys
from owlready2 import *
from functools import reduce

path_dir = (os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
sys.path.append(path_dir)

from src.config import config
from src.utils import typeData

# свойства к запросу для получения данных по названию
def getDataByNameProperty(typeSearch):
    if typeSearch is typeData.Books:
        prop1 = "Книги"
        prop2 = "ratingBook"
    elif typeSearch is typeData.Articles:
        prop1 = "Статьи"
        prop2 = "ratingArticle"
    elif typeSearch is typeData.Sites:
        prop1 = "Сайты"
        prop2 = "ratingWebResource"
    return prop1, prop2 

# свйоства к запросу для получения разных свойств у title
def getTitleThemesAndAuthorsProperty(typeSearch):
    if typeSearch is typeData.Books:
        prop1 = "КнигаНаписанаПро"
        prop2 = "КнигаНаписанаАвтором"
        prop3 = "urlBook"
        prop4 = "numberOfCitationsBook"
        prop5 = "bookFromResource"
        prop6 = "viewsBook"
        prop7 = "dowloadsBook"
        prop8 = "datePublishedBook"
    elif typeSearch is typeData.Articles:
        prop1 = "СтатьяНаписанаПро"
        prop2 = "СтатьяНаписанаАвтором"
        prop3 = "urlArticle"
        prop4 = "numberOfCitationsArticle"
        prop5 = "articleFromResource"
        prop6 = "viewsArticle"
        prop7 = "dowloadsArticle"
        prop8 = "datePublishedArticle"
    elif typeSearch is typeData.Sites:
        prop1 = "ВебРесурсНаписанПро"
        prop2 = "ВебресурсНаписанАвтором"
        prop3 = "urlWebResourse"
        prop4 = "numberOfCitationsWebResourse"
        prop5 = "webFromResource"
        prop6 = "viewsWebResourse"
        prop7 = "dowloadsWebResourse"
        prop8 = "datePublishedWebResourse"
    return prop1, prop2, prop3, prop4, prop5, prop6, prop7, prop8

# свойста для получения тем, на которые писал автор, и самих публикаций
def getAuthorThemesAndDataProperty():
    prop1 = "АвторПисалПро"
    prop2 = "АвторКниги"
    prop3 = "АвторСтатьи"
    prop4 = "АвторВебРесурса"
    prop5 = ["Книги", "Статьи", "Сайты"]
    return prop1, [prop2, prop3, prop4], prop5

# свойства для получения публикаций по теме
def getDataByThemesProperty(typeSearch):
    if typeSearch is typeData.Books:
        prop1 = "КнигаНаписанаПро"
        prop2 = "ratingBook"
    elif typeSearch is typeData.Articles:
        prop1 = "СтатьяНаписанаПро"
        prop2 = "ratingArticle"
    elif typeSearch is typeData.Sites:
        prop1 = "ВебРесурсНаписанПро"
        prop2 = "ratingWebResource"
    elif typeSearch is typeData.Authors:
        prop1 = "АвторПисалПро"
        prop2 = ""
    return prop1, prop2 

def getActualDataProperty():
    props = ["dateBook", "dateArticle"]
    return props

def getDataByDataPublishedProperty(typeSearch):
    if typeSearch is typeData.Books:
        prop1 = "Книги"
        prop2 = "datePublishedBook"
        prop3 = "ratingBook"
    elif typeSearch is typeData.Articles:
        prop1 = "Статьи"
        prop2 = "datePublishedArticle"
        prop3 = "ratingArticle"
    elif typeSearch is typeData.Sites:
        prop1 = "Сайты"
        prop2 = "datePublishedWebResource"
        prop3 = "ratingWebResource"
    return prop1, prop2, prop3 

# добавить полученное свойство в список
def addItemInList(item, prop, list):
    t = str(item[prop].toPython())
    t = re.sub(r'.*#',"", t)
    if t not in list:
        list.append(t)

# из списка с нескольми значениями, получить список с одним максимальным значением
def getListWithMaxElem(list1):
    if list1:
        try:
            return [reduce(lambda x, y: x if int(x) > int(y) else y, list1)]
        except:
            return list1
    return list1