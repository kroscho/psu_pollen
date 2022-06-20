from re import I
from owlready2 import *
import json
from datetime import date, datetime

path_dir = (os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
sys.path.append(path_dir)

from src.config import config
from src.utils import typeData
import api.services.spqrqlQueries.queries as queries
import api.services.spqrqlQueries.utils as utils


class SparqlQueries:
    def __init__(self) -> None:
        self.path = config['path']
        my_world = World()
        #path to the owl file is given here
        my_world.get_ontology(self.path).load()
        #sync_reasoner(my_world)  #reasoner is started and synchronized here
        self.graph = my_world.as_rdflib_graph()

    # получение публикаций по названию
    def getDataByNames(self, title, typeSearch, page, limit):
        prop1, prop2 = utils.getDataByNameProperty(typeSearch)

        title = title.lower()
        if title != "":
            query = queries.getDataByNameQuery(prop1, title)
        else:
            query = queries.getAllDataQuery(prop1, prop2)
        
        resultsList = self.graph.query(query)

        response = []

        for item in resultsList:
            title = str(item['title'].toPython())
            title = re.sub(r'.*#',"", title)
            #print(title)
            #print()
            themes, authors, url, citations, resourses, views, dowloads, datePublished = self.getTitleThemesAndAuthors(title, typeSearch)
            themes = self.getItemsInListClean(themes)
            authors = self.getItemsInListClean(authors)
            if themes != [] or authors != []:
                response.append({'title' : title.replace("_", " "), 'themes': themes, 'authors': authors, 'url': url, 'citations': citations, 'resourse': resourses, 'views': views, 'dowloads': dowloads, 'datePublished': datePublished})
        
        total_count = len(response)
        response = response[(int(page)-1)*int(limit) * 10:int(page)*int(limit) * 10]
        print("total: ", len(response))
        return response, total_count

     # получаем темы и авторов у книги или статьи
    def getTitleThemesAndAuthors(self, title, typeSearch):
        prop1, prop2, prop3, prop4, prop5, prop6, prop7, prop8 = utils.getTitleThemesAndAuthorsProperty(typeSearch)
 
        if typeSearch is typeData.Sites:
            query = queries.getPropertyForWebResourseQuery(prop1, prop3, prop5, title) # тут надо для начала сделать агента для парсинга веб ресурсов
        else:
            query = queries.getPropertyForBookOrArticleQuery(prop1, prop2, prop3, prop4, prop5, prop6, prop7, prop8, title)
        #print("Запрос: ", query)

        themes = []
        authors = []
        url_list = []
        citations = []
        resourses = []
        views = []
        dowloads = []
        datePublished = []

        try:
            result = self.graph.query(query)
        except Exception:
            print("тут ошибка: ", title)
        else:
            for item in result:
                utils.addItemInList(item, 'theme', themes)
                utils.addItemInList(item, 'url', url_list)
                utils.addItemInList(item, 'resourse', resourses)
                utils.addItemInList(item, 'views', views)
                utils.addItemInList(item, 'dowloads', dowloads)
                utils.addItemInList(item, 'datePublished', datePublished)

                if typeSearch is not typeData.Sites:
                    utils.addItemInList(item, 'author', authors)
                    utils.addItemInList(item, 'numberOfCitations', citations)

        return themes, authors, url_list, utils.getListWithMaxElem(citations), resourses, utils.getListWithMaxElem(views), utils.getListWithMaxElem(dowloads), datePublished

    def getItemsInListClean(self, list):
        newList = []
        for item in list:
            newList.append(item.replace("_", " "))
        return newList

    def getItemsInDictClean(self, list):
        newList = []
        for item in list:
            newList.append(item.replace("_", " "))
        return newList

    def calcIndexHirsch(self, items):
        h = 0
        if items:
            items = sorted(items, key=lambda item:int(item['numberOfCitations'][0]), reverse=True)
            for i in range(len(items)):
                if i > int(items[i]['numberOfCitations'][0]):
                    h = i + 1
                    return h
        return h

    # получение авторов по названию
    def getAuthorByNames(self, name, typeSearch, page, limit):
        name = name.lower()
        
        query = queries.getAuthorByNameQuery(name)
        result = self.graph.query(query)

        response = []

        for item in result:
            author = str(item['author'].toPython())
            author = re.sub(r'.*#',"", author)
            #print(author)
            #print()
            themes, items = self.getAuthorThemesAndData(author)

            themes = self.getItemsInListClean(themes)
            hirsch = self.calcIndexHirsch(items)
            #print("Хирша: ", hirsch)
            #items = self.getItemsInListClean(items)
            if not (themes == [] or items == []):
                response.append({'author' : author.replace("_", " "), 'themes': themes, 'items': items, 'index_hirsch': hirsch})
        
        response = sorted(response, key=lambda item:int(item['index_hirsch']), reverse=True)
        total_count = len(response)
        response = response[(int(page)-1)*int(limit) * 10:int(page)*int(limit) * 10]
        #print(response)
        return response, total_count

    # получаем темы и публикации у автора
    def getAuthorThemesAndData(self, name):
        prop1, props2, prop3 = utils.getAuthorThemesAndDataProperty()
        queryGetThemes = queries.getAuthorThemesQuery(name, prop1)

        themes = []
        items = []

        # получаем темы
        try:
            resultThemes = self.graph.query(queryGetThemes)
        except Exception:
            print("тут ошибка: ", name)
        else:
            for item in resultThemes:
                utils.addItemInList(item, 'theme', themes)
        
        # получаем публикации
        for i in range(len(props2)):
            queryGetItems = queries.getAuthorItemsQuery(name, props2[i])
            try:
                resultItems = self.graph.query(queryGetItems)
            except Exception:
                print("тут ошибка: ", name)
            else:
                if i == 0:
                    typeSrch = typeData.Books
                elif i == 1:
                    typeSrch = typeData.Articles
                else:
                    typeSrch = typeData.Sites

                for item in resultItems:
                    item = str(item['item'].toPython())
                    item = re.sub(r'.*#',"", item)
                    themes_item, authors, url, citations, resourses, views, dowloads, datePublished = self.getTitleThemesAndAuthors(item, typeSrch)
                    if citations == []:
                        citations = ['0']
                    item = {'title' : item.replace("_", " "), 'url': url, 'numberOfCitations': citations}
                    if item not in items:
                        items.append(item)
        #print("items: ", items)
        #print(themes, items)
        return themes, items

    # получаем данные по темам
    def getDataByTheme(self, theme, typeSearch, page, limit):
        prop1, prop2 = utils.getDataByThemesProperty(typeSearch)

        if typeSearch is typeData.Authors:
            query = queries.getAuthorsByThemesQuery(theme, prop1)
        else:
            query = queries.getDataByThemesQuery(theme, prop1, prop2)
        print("Запрос: ", query)

        result = self.graph.query(query)
        response = []

        if typeSearch is typeData.Authors:
            for item in result:
                author = str(item['author'].toPython())
                author = re.sub(r'.*#',"", author)
                themes, items = self.getAuthorThemesAndData(author)
                themes = self.getItemsInListClean(themes)
                hirsch = self.calcIndexHirsch(items)
                #print("Хирша: ", hirsch)
                #items = self.getItemsInListClean(items)
                if not (themes == [] or items == []):
                    response.append({'author' : author.replace("_", " "), 'themes': themes, 'items': items, 'index_hirsch': hirsch})
        else:
            for item in result:
                title = str(item['title'].toPython())
                title = re.sub(r'.*#',"", title)
                themes, authors, url, citations, resourses, views, dowloads, datePublished = self.getTitleThemesAndAuthors(title, typeSearch)
                themes = self.getItemsInListClean(themes)
                authors = self.getItemsInListClean(authors)
                if themes != [] or authors != []:
                    response.append({'title' : title.replace("_", " "), 'themes': themes, 'authors': authors, 'url': url, 'citations': citations, 'resourse': resourses, 'views': views, 'dowloads': dowloads, 'datePublished': datePublished})
        
        if typeSearch is typeData.Authors:
            response = sorted(response, key=lambda item:int(item['index_hirsch']), reverse=True)
        total_count = len(response)
        response = response[(int(page)-1)*int(limit) * 10:int(page)*int(limit) * 10]
        #print(response)
        return response, total_count

    # получаем актуальные данные за последние 2 дня
    def getDataByData(self, page, limit):
        props = utils.getActualDataProperty()
        
        curTime = datetime.now()
        strDate = datetime(int(curTime.year), int(curTime.month), int(curTime.day - 3), 0, 0, 0).isoformat()
        response = []

        for prop in props:
            query = queries.getActualDataQuery(prop, strDate)
            print("Запрос: ", query)

            result = self.graph.query(query)

            for item in result:
                title = str(item['title'].toPython())
                title = re.sub(r'.*#',"", title)
                themes, authors, url, citations, resourses, views, dowloads, datePublished = self.getTitleThemesAndAuthors(title, typeData.Books)
                themes = self.getItemsInListClean(themes)
                authors = self.getItemsInListClean(authors)
                if themes != [] or authors != []:
                    response.append({'title' : title.replace("_", " "), 'themes': themes, 'authors': authors, 'url': url, 'citations': citations, 'resourse': resourses, 'views': views, 'dowloads': dowloads, 'datePublished': datePublished})
            
        total_count = len(response)
        response = response[(int(page)-1)*int(limit) * 10:int(page)*int(limit) * 10]
        print(response, total_count)
        return response, total_count

    # получаем актуальные данные за последние 2 дня
    def getDataByDatePublished(self, year, typeSearch, page, limit):
        prop1, prop2 = utils.getDataByNameProperty(typeSearch)
        query = queries.getAllDataQuery(prop1, prop2)
        resultsList = self.graph.query(query)
        response = []

        for item in resultsList:
            title = str(item['title'].toPython())
            title = re.sub(r'.*#',"", title)
            #print(title)
            #print()
            themes, authors, url, citations, resourses, views, dowloads, datePublished = self.getTitleThemesAndAuthors(title, typeSearch)
            themes = self.getItemsInListClean(themes)
            authors = self.getItemsInListClean(authors)
            if themes != [] or authors != []:
                response.append({'title' : title.replace("_", " "), 'themes': themes, 'authors': authors, 'url': url, 'citations': citations, 'resourse': resourses, 'views': views, 'dowloads': dowloads, 'datePublished': datePublished})
        
        def filter_year(item):
            return int(item['datePublished'][0]) > year
        
        def keySort(item):
            return int(item['datePublished'][0])

        response = list(filter(filter_year, response))
        response.sort(key=keySort)
        total_count = len(response)

        response = response[(int(page)-1)*int(limit) * 10:int(page)*int(limit) * 10]
        print("total: ", len(response))
        return response, total_count

def main():
    ont = SparqlQueries()
    #ont.getDataByNames("Палино", typeData.Books)
    ont.getAuthorByNames("ник", typeData.Authors, 1, 10)
    #ont.getDataByTheme("палинология", typeData.Authors, 1, 10)
    #ont.getDataByDatePublished(2016, typeData.Sites, 1, 10)


if __name__ == "__main__":
    main()