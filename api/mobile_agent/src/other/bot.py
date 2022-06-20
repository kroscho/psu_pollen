import requests
from bs4 import BeautifulSoup
from owlready2 import *
from enum import Enum
from datetime import datetime

countNewItem = 0
# тип поиска (книги или статьи)
class search(Enum):
    Books = 1
    Articles = 2
    Sites = 3

# Результаты поиска гугл 
class SearchResult:
    def __init__(self, query):
        self.query = query.replace(' ', '+')
    

    # очищаем строку от ненужных символов
    def clean_str(self, str, aut):
        if self.typeSearch is search.Articles and aut:
            str = str[0 : str.find("-")]
        elif self.typeSearch is search.Books and aut:
            str = str.replace("Авторы:", '').replace("редактор(ы):", '').strip()
            if str.find("·") != -1:
                str = str[0 : str.find("·")]
        #chars = [u'\xa0', '"', '...', '|', '…', ',', '\'', '(', ')']
        chars = ['\\','`', '"','*','{','}', '|', '…', '·', '“', '[',']','(',')','>', '<', 'ʹ', '#', '•', '»', '›', '.', '❤', '/' '<','>','?','+','-','.','!','$','\'', '©', ';', ':', '—']
        for ch in chars:
            if ch in str:
                str = str.replace(ch, " ")
        if self.typeSearch is search.Articles:        
            str = str.replace(u'\xa0', u'').replace(',', '_').replace(' ', '_')
        else:
            if aut:
                str = str.replace(u'\xa0', u'').replace(' ', '_')
            else:
                 str = str.replace(u'\xa0', u'').replace(',', '_').replace(' ', '_')
        

        res = ""
        count_ = 0
        f = False
        for char in str:
            if char == '_':
                count_ += 1
                f = False
            else:
                f = True
                if count_ == 1:
                    count_ = 0
            if count_ < 2:
                res += char
            elif f:
                res += char
                count_ = 0
        res = res.strip("_")
        return res


    # поиск авторов для книг
    def get_authors(self, url):
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, 'lxml')
        for aut in soup.find_all("span", class_="addmd"):
            return aut.text
        for aut in soup.find_all("div", attrs = {"class":"bookinfo_sectionwrap"}):
            return aut.contents[0].text
        return ""

    # поиск книг
    def get_books(self, url, results, i, page_):

        f = False
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, 'lxml')
        
        # тут заголовки            
        for entry in soup.find_all("h3"):
            title = self.clean_str(entry.text, False)
            results.append({'title': title})
        k = 1
        # тут URL + авторы
        for entry in soup.find_all("div", attrs={"class": "kCrYT"}):
            # там выводятся по 2 ссылки, поэтому выбираем только одну из двух
            if k % 2 != 0:
                results[i]['url'] = entry.a['href']
                results[i]['author'] = self.clean_str(self.get_authors(entry.a['href']), True)
                results[i]['type'] = "КНИГА"
                results[i]['rating'] = page_ / 10 + 1
                now = datetime.now()
                strDate = datetime(now.year, now.month, now.day, 0, 0, 0).isoformat()
                objDate = datetime.strptime(strDate,"%Y-%m-%dT%H:%M:%S")
                results[i]['date'] = objDate
                i += 1
            k += 1  
            f = True 
        return f

    # поиск статей  
    def get_articles(self, url, results, page_):
        f = False
        content = requests.get(url).text
        page = BeautifulSoup(content, 'lxml')            
        
        for entry in page.find_all("div", attrs={"class": "gs_ri"}):
            count_quote = 0
            entry1 = entry.find("h3", attrs={"class": "gs_rt"})
            book_text = entry1.find(class_ = "gs_ct1")
            if book_text and book_text.text == "[КНИГА]":
                type = "КНИГА"
            else: 
                type = "СТАТЬЯ"
            title = entry1.a.text
            #title = title.replace(u'\xa0', u'').replace('"', '').replace('...', '').replace('…', '').replace('|', '').replace('\'', '').replace(',', '').replace('(', '_').replace(')', '_').replace(' ', '_')
            title = self.clean_str(title, False)
            url = entry1.a['href']
            author = self.clean_str(entry.find(class_="gs_a").text, True)
            quote = entry.find(class_ = "gs_fl")
            for q in quote.find_all("a"):
                if (q.text.find("Цитируется")!=-1):
                    count_quote = int(q.text[q.text.find(":")+2:len(q.text)])
            now = datetime.now()
            strDate = datetime(now.year, now.month, now.day, 0, 0, 0).isoformat()
            objDate = datetime.strptime(strDate,"%Y-%m-%dT%H:%M:%S")
            results.append({"title": title, "url": url, "type": type, "author": author, "count_quote": count_quote, "rating": page_ / 10 + 1, "date": objDate})
            f = True
        return f
        #print(results)

    # поиск сайтов (гугл)
    def get_sites_google(self, url, results, page_):
        f = False
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, 'lxml')            
        k = 1 
        for entry in soup.find_all("div", attrs={"class": "kCrYT"}):
            #if k%2 != 0:
            if entry.a:
                if entry.a.text != "Картинки":
                    if entry.a.text.find('Результаты поиска по') == -1:                        
                        # если это не статья и не книга, то добавляем
                        if entry.a.text.find('[PDF]') == -1 and entry.a.text.find('books.google') == -1:
                            url = entry.a['href'].replace('/url?q=', '')
                            url = url[0:url.find('&sa=')].strip()
                            if entry.h3:
                                #title = entry.h3.text.replace(u'\xa0', u'').replace('"', '').replace('...', '').replace('…', '').replace('|', '').replace('\'', '').replace(',', '').replace('(', '_').replace(')', '_').replace(' ', '_')
                                title = self.clean_str(entry.h3.text, False)
                            else:
                                title = self.clean_str(entry.a.text, False)
                                #title = entry.a.text.replace(u'\xa0', u'').replace('"', '').replace('...', '').replace('…', '').replace('|', '').replace('\'', '').replace(',', '').replace('(', '_').replace(')', '_').replace(' ', '_')
                            now = datetime.now()
                            strDate = datetime(now.year, now.month, now.day, 0, 0, 0).isoformat()
                            objDate = datetime.strptime(strDate,"%Y-%m-%dT%H:%M:%S")
                            results.append({"title": title, "url": url, "type": "САЙТ", "author": [], "rating": page_ / 10 + 1, "date": objDate})                            
                            f = True
                else:
                    k -= 1
            else:
                k -= 1
            k += 1 
        return f      

    # деление авторов по отдельности (статьи)
    def splitArticleAuthors(self, searchArticleResult):
        for i in searchArticleResult:
            k = 0
            result = []
            author = ""
            for char in i['author']:
                if char == '_':
                    if k % 2 == 1:
                        result.append(author.strip())
                        author = ""
                    else:
                        author += char
                    k += 1 
                   
                else:
                    author += char
            result.append(author.strip())
            i['author'] = result        


    # деление авторов по отдельности (книги)
    def splitBooksResult(self, searchBookResult):
        for i in searchBookResult:
            result = []
            author = i['author'] 
            index = 0
            while index != -1:
                index = author.find(",")
                if index != -1:
                    aut = author[0: index].strip('_').strip()
                    author = author[index + 1:len(author)+1]
                else:
                    aut = author.strip('_').strip()
                if author == "":
                    #i['author'] = "Не_найден"
                    result.append("Не найден")
                else:    
                    #i['author'] = author.strip()
                    result.append(aut.strip('_').strip())
            i['author'] = result
            

    # поиск результатов
    def search(self, typeSearch):
        page_ = 0
        i = 0
        k = 0
        results = []
        self.typeSearch = typeSearch
        f = True           
        while f: 
            start_time = time.monotonic()
            if self.typeSearch is search.Books:
                url = 'https://www.google.com/search?q=' + self.query + '&tbm=bks&sxsrf=ALeKk001DXhruKQYY1Rr2PCCAv-m_VLOfg:1613307363334&ei=4x0pYPXnE-HHrgTU26XAAw&start=' + str(page_) + '&sa=N&ved=0ahUKEwi15beitunuAhXho4sKHdRtCTg4ChDy0wMIdw&biw=896&bih=754&dpr=1.25'
                f = self.get_books(url, results, i, page_)
            elif self.typeSearch is search.Articles:
                url = 'https://scholar.google.com/scholar?start=' + str(page_) + '&q=' + self.query + '&hl=ru&as_sdt=1,5&as_vis=1'
                f = self.get_articles(url, results, page_)     
            elif self.typeSearch is search.Sites:
                url = 'https://www.google.com/search?q=' + self.query + '&rlz=1C1PNBB_ruRU900RU900&sxsrf=ALeKk03WBG-UBqflFo50CcZjNZ2Uy8rEdA:1613941804874&ei=LMwyYKnvNLSMwPAP27iFqA0&start=' + str(page_) + '&sa=N&ved=2ahUKEwiptd7f8fvuAhU0BhAIHVtcAdU4FBDy0wN6BAgEEDo&biw=896&bih=754'  
                f = self.get_sites_google(url, results, page_)
            i = len(results)
            k += 1
            print("Страница ", k, " обработана успешно: ", f, "\nПроцесс ожидания...")  
            page_ += 10     
            #if k == 10:
                #break
            end_time = time.monotonic()
            while end_time - start_time < 5:
                end_time = time.monotonic()
            
 
        #print(results)

        if self.typeSearch is search.Books:
            self.splitBooksResult(results)
        elif self.typeSearch is search.Articles:
            self.splitArticleAuthors(results)

        return results

class SparqlQueries:
    def __init__(self, path):
        my_world = World()
        #path to the owl file is given here
        my_world.get_ontology(path).load()
        #sync_reasoner(my_world)  #reasoner is started and synchronized here
        self.graph = my_world.as_rdflib_graph()

    def getThemes(self):
        query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/0/untitled-ontology-27#>" \
                "SELECT ?theme " \
                "WHERE { " \
                "?theme rdf:type pln:Темы. " \
                "}"
        
        resultsList = self.graph.query(query)

        response = []

        for item in resultsList:
            subj = str(item['theme'].toPython())
            subj = re.sub(r'.*#',"",subj)
            response.append(subj)
        
        return response

    # получение классов для подклассов
    def getSubClasses(self):
        query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/0/untitled-ontology-27#>" \
                "SELECT ?subject ?object " \
                "WHERE { " \
                "?subject rdfs:subClassOf ?object" \
                "}"
        
        resultsList = self.graph.query(query)

        response = {}

        for item in resultsList:
            subj = str(item['subject'].toPython())
            subj = re.sub(r'.*#',"",subj)
            obj = str(item['object'].toPython())
            obj = re.sub(r'.*#',"",obj)
            #response.append({subj: obj})
            response[subj] = obj
        
        #print(response)
        return response

'''
class WorkWithQuery:
    def __init__(self, path):
        self.path = path
        
    # получаем поисковую строку из того что ввели
    def getQuery(self, query , typeSearch):
        runQuery = SparqlQueries(self.path, typeSearch)
        resList = runQuery.getSubClasses()
        del runQuery
        levs = [(key, Levenshtein.ratio(query, key)) for key in resList.keys()]
        key, score = max(levs, key=lambda lev: lev[1])
        return key

    # получаем темы для статьи или книги(про что написано)
    def getAllThemes(self, query, typeSearch):
        runQuery = SparqlQueries(self.path, typeSearch)
        resultThemes = []
        resList = runQuery.getSubClasses()
        del runQuery
        #checkList = ['СкульптураЗерна', 'ФормаЗерна', 'СоставЗерна', 'ТипыЗеренВЗависимостиОтПолярности', 'ФормированиеЗерна', 'ПыльцевыеЗерна']
        checkList = ['Темы']
        resultThemes.append(query)
        while True:
            if query in checkList:
                break 
            levs = [(key, Levenshtein.ratio(query, key)) for key in resList.keys()]
            key, score = max(levs, key=lambda lev: lev[1])
            query = resList.get(key)
            if query not in checkList:
                resultThemes.append(query)
        return resultThemes

    # деление строки по словам
    def splitQuery(self, query):
        result = ""
        for char in query:
            if char == char.upper() and char != '-':
                result += " " + char.lower()
            else:
                result += char
        return result
'''

    
# добавление результатов в онтологию
class WorkWithOntology:
    def __init__(self, path):
        onto_path.append(path)
        self.onto = get_ontology(path)
        self.onto.load()
        self.onto.save(path)
        self.path = path

    # делим список на части
    def SplitList(self, item):
        authors = item.get('author')
        title = item.get('title')
        url = item.get('url')
        type = item.get('type')
        rating = item.get('rating')
        date = item.get('date')
        return title, authors, url, type, rating, date

    # запись в онтологию книги или статьи
    def RecordingBookOrArticle(self, title, authors, url, type, rating, date):          
        with self.onto:
            class Авторы(Thing):
                pass
            class Статьи(Thing):
                pass
            class Книги(Thing):
                pass
            class Сайты(Thing):
                pass
            class date_article(DataProperty):
                domain = [Статьи]
                range = [datetime]
            class date_book(DataProperty):
                domain = [Книги]
                range = [datetime]
            class date_site(DataProperty):
                domain = [Сайты]
                range = [datetime]
        
        if type == "СТАТЬЯ":                
            for author in authors:    
                new_title = Статьи(title.replace(' ', '_'))
                new_aut = Авторы(author.replace(' ', '_'))
                new_aut.АвторСтатьи.append(new_title)
                new_title.СтатьяНаписанаАвтором.append(new_aut)
                new_title.URL_article = url
                new_title.rating_article.append(rating)
                new_title.date_article = date
                              
        elif type == "КНИГА": 
            for author in authors: 
                new_title = Книги(title.replace(' ', '_'))
                new_aut = Авторы(author.replace(' ', '_')) 
                new_aut.АвторКниги.append(new_title)
                new_title.КнигаНаписанаАвтором.append(new_aut)
                new_title.URL_book = url
                new_title.rating_book.append(rating)
                new_title.date_book = date
        
        elif type == "САЙТ":
                new_site = Сайты(title.replace(' ', '_'))
                new_site.URL_site = url
                new_site.rating_site.append(rating)
                new_site.date_site = date

        self.onto.save(self.path) 

    # запись в онтологию книг или статей с их тематиками
    def RecordingResultsWithThemes(self, resultsList, resultThemes):            

        # проверка на существование этой книги или статьи в онтологии
        def CheckExist(item):
            existList = self.onto.search(iri = "*" + item)
            if existList == []:
                return False
            return True 

        with self.onto:    
            class Авторы(Thing):
                pass
            class Статьи(Thing):
                pass
            class Книги(Thing):
                pass
            class Сайты(Thing):
                pass
        
        #checkList = ['Борозды', 'Лептомы', 'Поры', 'Руги', 'Щели', 'Бороздно-оровые', 'Бороздно-поровые', 'Порово-оровые', '',]
        for item in resultsList:
            title, authors, url, type, rating, date = self.SplitList(item)
            
            if CheckExist(title.replace(' ', '_')) == False:
                self.RecordingBookOrArticle(title, authors, url, type, rating, date)
                global countNewItem
                countNewItem += 1
            for theme in resultThemes:             
                typeClass = theme
                class_var = self.onto[typeClass]
                                
                if type == "КНИГА":
                    for author in authors:
                        try:
                            new_title = Книги(title.replace(' ', '_'))
                        except Exception:
                            print("Не добавлена книга")
                        else:
                            new_aut = Авторы(author.replace(' ', '_'))
                            new_aut.ПисалПро.append(class_var)
                            try:
                                new_title.КнигаНаписанаПро.append(class_var)
                            except Exception:
                                print("ошибка", new_title, "   ", class_var)
                            else:
                                new_title.rating_book.append(rating)
                elif type == "СТАТЬЯ": 
                    count_quote = item.get('count_quote')
                    for author in authors: 
                        try:
                            new_title = Статьи(title.replace(' ', '_'))
                        except Exception:
                            print("Не добавлена статья")
                        else:
                            new_aut = Авторы(author.replace(' ', '_'))
                            new_aut.ПисалПро.append(class_var)
                            try:
                                new_title.СтатьяНаписанаПро.append(class_var)
                            except Exception:
                                print("ошибка", new_title, "   ", class_var)
                            else:
                                new_title.Count_quotes.append(count_quote)
                                new_title.rating_article.append(rating)
                elif type == "САЙТ":
                    try:
                        new_site = Сайты(title.replace(' ', '_'))
                    except Exception:
                        print("Не добавлен сайт")
                    else:
                        try:
                            new_site.СайтНаписанПро.append(class_var)
                        except Exception:
                            print("ошибка: ", new_site)
                        else: 
                            new_site.rating_site.append(rating)

                self.onto.save(self.path) 

def main():

    path = r"D:\Desktop\ПМИ\3_курс\Курсовая\Готовое\psu-monitoring\api\polynology.owl"
    typeSearch = search.Books
 
    runQuery = SparqlQueries(path)
    # получаем все темы по которым будем делать запрос к гуглу
    resListThemes = runQuery.getThemes()
    del runQuery
    print(resListThemes)

    addRes = WorkWithOntology(path)

    t = 0
    for theme in resListThemes:
        if t>=0: 
            themeList = []
            # для темы получаем ее надтемы
            themeList.append(theme)
            # получаем запрос
            query = theme.replace('__', ' ').strip()
            print(query, " : ", themeList)
            # поиск с гугла
            searchRes = SearchResult(query)
            searchResList = searchRes.search(typeSearch)
            # добавление результатов в онтологию
            addRes.RecordingResultsWithThemes(searchResList, themeList)
            print(countNewItem)
        t += 1
        #if t == 10:
         #   break
        
    del addRes
    del searchRes


if __name__ == "__main__":
    main()