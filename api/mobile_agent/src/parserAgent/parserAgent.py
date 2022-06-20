import requests
from bs4 import BeautifulSoup
from datetime import datetime
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import time
from pygrok import Grok
#from parserSettings import settings
import os, sys

path_dir = (os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(path_dir)

import utils
from parserAgent.parserSettings import settings

# агент
class MobileAgent(object):
    def __init__(self, resource, query):
        self.resource = resource
        self.query = query.replace(' ', '+')
        self.result = []

    # поиск результатов
    def start(self):
        currentItem = 0
        currentPage = 1
        isLastPage = False 
        driver = None          

        parse = self.getResourse()
        
        pageNumber = parse.startPageNumber
        if parse.isUseWebdriver:
            driver = webdriver.Chrome(ChromeDriverManager().install())

        while not isLastPage: 
            start_time = time.monotonic()
            result_copy = self.result 
            try:
                isLastPage = parse.getData(self.result, self.query, currentPage, pageNumber, isLastPage, driver)
            except:
                print("Страница ", currentPage, " произошла ошибка. \nПроцесс ожидания...")
                pageNumber = parse.getNumberNextPage(pageNumber)    
                if currentPage == int(settings['max_pages']):
                    break
                currentPage += 1
            else:
                currentItem = len(self.result)
                print("Страница ", currentPage, " обработана успешно: ", not isLastPage, "\nПроцесс ожидания...")  
                pageNumber = parse.getNumberNextPage(pageNumber)    
                if currentPage == int(settings['max_pages']):
                    break
                currentPage += 1
                end_time = time.monotonic()
                while end_time - start_time < settings['min_time_parse']:
                    end_time = time.monotonic()
            
        print(result_copy)
        return result_copy

    def getResourse(self):
        if self.resource is utils.parseResource.GoogleSearch:
            parse = GoogleSearch()
            return parse

        elif self.resource is utils.parseResource.GoogleBooks:
            parse = GoogleBooks()
            return parse

        elif self.resource is utils.parseResource.MicrosoftAcademic:
            parse = MicrosoftAcademic()
            return parse

        elif self.resource is utils.parseResource.CyberLeninka:
            parse = CyberLeninka()
            return parse

        elif self.resource is utils.parseResource.PubMed:
            parse = PubMed()
            return parse

        elif self.resource is utils.parseResource.Frontiersin:
            parse = Frontiersin()
            return parse

class Parser:
    def __init__(self, query):
        pass

    def __split(self, str):
        return [char for char in str]

    # получение даты добавления в онтологию в виде объекта
    def getNowDate(self):
        now = datetime.now()
        strDate = datetime(now.year, now.month, now.day, 0, 0, 0).isoformat()
        objDate = datetime.strptime(strDate,"%Y-%m-%dT%H:%M:%S")
        return objDate

    # поиск года публикации в строке
    def getDatePublished(self, str):
        date_pattern = '%{YEAR:year}'
        grok = Grok(date_pattern)
        try:
            datePublished = grok.match(str).get('year')
        except Exception:
            print("Нет даты публикации")
            return 2000
        else:
            if len(datePublished) == 4:
                return datePublished
            else:
                return 2000

    # очищаем строку от лишних символов
    def normalize_str(self, str):
        #extraСharacters = ['\\','`', '"','*','{','}', '|', '…', '·', '“', '[',']','(',')','>', '<', 'ʹ', '#', '•', '»', '›', '.', '❤', '/' '<','>','?','+','-','.','!','$','\'', '©', ';', ':', '—']
        allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧЩШЪЫЬЭЮЯ '
        allowedCharacters = self.__split(allowedCharacters)
        
        for ch in str:
            if ch not in allowedCharacters:
                str = str.replace(ch, " ")
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

class GoogleSearch(Parser):
    isUseWebdriver = False
    startPageNumber = 0

    def __init__(self):
        pass

    # парсинг Google Academy
    def getData(self, result, query, currentPage, pageNumber, isLastPage, driver):

        url = 'https://scholar.google.ru/scholar?start=%s&q=%s&hl=ru&as_sdt=0,5&as_vis=1' % (pageNumber, query)
        soup = requests.get(url)
        page = BeautifulSoup(soup.text, 'lxml')   

        isLastPage = True

        for entry in page.find_all("div", attrs={"class": "gs_ri"}):
            numberOfCitations = 0
            entry1 = entry.find("h3", attrs={"class": "gs_rt"})
            book_text = entry1.find(class_ = "gs_ct1")
            if book_text and book_text.text == "[КНИГА]":
                type = utils.typeParseItem.Book.value
            else: 
                type = utils.typeParseItem.Article.value
            title = self.getNormalizeStrTitle(entry1.a.text)
            url = entry1.a['href']
            author = self.getNormalizeStrAuthor(entry.find(class_="gs_a").text)
            datePublished = self.getDatePublished(entry.find(class_="gs_a").text)
            quote = entry.find(class_ = "gs_fl")
            for q in quote.find_all("a"):
                if (q.text.find("Цитируется") != -1):
                    numberOfCitations = int(q.text[q.text.find(":") + 2:len(q.text)])
            #objDate = self.getNowDate()
            result.append({"title": title, "url": url, 'date': '', "type": type, "author": author, "numberOfCitations": numberOfCitations, "views": 0, "dowloads": 0, "datePublished": datePublished, "theme": query.replace("+", " "), "rating": currentPage, "resource": utils.parseResourceText.GoogleSearch.value})
            #print({"title": title, "url": url, "type": type, "author": author, "numberOfCitations": numberOfCitations, "views": 0, "dowloads": 0, "datePublished": 1111, "date": objDate})
            isLastPage = False
        return isLastPage

    def getNormalizeStrAuthor(self, str):
        result = []
        str = str[0 : str.find("-")]
        str = str.split(',')
        for author in str:
            result.append(self.normalize_str(author))
        return result
          
    def getNormalizeStrTitle(self, str):
        return self.normalize_str(str)

    def getNumberNextPage(self, pageNumber):
        return pageNumber + 10

class GoogleBooks(Parser):
    isUseWebdriver = False
    startPageNumber = 0

    def __init__(self):
        pass

    # поиск авторов для книг
    def getAuthorsGoogleBooks(self, url):
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, 'lxml')
        for aut in soup.find_all("span", class_="addmd"):
            return aut.text
        for aut in soup.find_all("div", attrs = {"class": "bookinfo_sectionwrap"}):
            return aut.find("span").text
        return ""

    # парсинг Google Books
    def getData(self, result, query, currentPage, pageNumber, isLastPage, driver):
        
        url = 'https://www.google.com/search?q=%s&tbm=bks&sxsrf=AOaemvKSEtg2rFaVSWt-XFTJ3JVMnXZHnQ:1636213497953&ei=-aKGYYXDOZGyrgSPpa_oDA&start=%s&sa=N&ved=2ahUKEwjFo8miioT0AhURmYsKHY_SC80Q8tMDegQIARBC&biw=1536&bih=722&dpr=1.25' % (query, pageNumber)
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, 'lxml')
        
        isLastPage = True

        for entry in soup.find_all("div", attrs={"class": "kCrYT"}):
            title = entry.find("div", attrs={"class": "BNeawe vvjwJb AP7Wnd"})
            numberOfCitations = 0
            if title:
                title = self.getNormalizeStrTitle(title.text)
                url = entry.a['href']
                authorAndDatePublished = self.getAuthorsGoogleBooks(url)
                author = self.getNormalizeStrAuthor(authorAndDatePublished)
                datePublished = self.getDatePublished(authorAndDatePublished)
                type = utils.typeParseItem.Book.value
                #objDate = self.getNowDate()
                result.append({"title": title, "url": url, 'date': '', "type": type, "author": author, "numberOfCitations": numberOfCitations, "views": 0, "dowloads": 0, "datePublished": datePublished, "theme": query.replace("+", " "), "rating": currentPage, "resource": utils.parseResourceText.GoogleBooks.value})
                isLastPage = False
        
        return isLastPage

    def getNormalizeStrAuthor(self, str):
        result = []
        str = str.replace("Авторы:", '').replace("редактор(ы):", '').strip()
        if str.find("·") != -1:
            str = str[0 : str.find("·")]

        str = str.split(',')
        for author in str:
            result.append(self.normalize_str(author))
        return result
        
    def getNormalizeStrTitle(self, str):
        return self.normalize_str(str)

    def getNumberNextPage(self, pageNumber):
        return pageNumber + 10

class MicrosoftAcademic(Parser):
    isUseWebdriver = True
    startPageNumber = 0
    
    def __init__(self):
        pass

    # парсинг с microsoft academic
    def getData(self, result, query, currentPage, pageNumber, isLastPage, driver):
        url = 'https://academic.microsoft.com/search?q=%s&f=&orderBy=0&skip=%s&take=10'  % (query, pageNumber) # за страницу отвечает skip: 0, 10, 20 ...
        href = 'https://academic.microsoft.com/'
        
        #driver = webdriver.Chrome()
        #driver = webdriver.Chrome(ChromeDriverManager().install())
        driver.get(url)
        time.sleep(5)
        html = driver.page_source
        page = BeautifulSoup(html, "html.parser")
        
        isLastPage = True

        for entry in page.find_all("div", attrs={"class": "primary_paper"}):
            title = self.getNormalizeStrTitle(entry.find("a", attrs={"class", "title au-target"}).text)
            url = href + entry.find("a", attrs={"class", "title au-target"})['href']
            type = utils.typeParseItem.Article.value
            author = []
            entry1 = entry.find_all("a", attrs={"class", "au-target author link"})
            for aut in entry1:
                author.append(self.getNormalizeStrAuthor(aut.text))
            datePublished = self.getDatePublished(entry.find("span", attrs={"class", "year au-target"}).text)
            print(datePublished)
            entry1 = entry.find("div", attrs={"class", "citations"})
            numberOfCitations = self.getNumberCitation(entry1.find("span").text)
            #objDate = self.getNowDate()
            result.append({"title": title, "url": url, 'date': '', "type": type, "author": author, "numberOfCitations": numberOfCitations, "views": 0, "dowloads": 0, "datePublished": datePublished, "theme": query.replace("+", " "), "rating": currentPage, "resource": utils.parseResourceText.MicrosoftAcademic.value})
            isLastPage = False
        
        return isLastPage

    def getNormalizeStrAuthor(self, str):
        return self.normalize_str(str)
        
    def getNormalizeStrTitle(self, str):
        return self.normalize_str(str)

    def getNumberCitation(self, str):
        index = str.find("cit")
        str = str[0:index].strip()
        return str

    def getNumberNextPage(self, pageNumber):
        return pageNumber + 10

class CyberLeninka(Parser):
    isUseWebdriver = True
    startPageNumber = 1

    def __init__(self):
        pass
    
    # поиск авторов для книг
    def getViewsAndDowloadsCyberLink(self, url):
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, 'lxml')
        
        views = soup.find("div", attrs={"class": "statitem views"})
        dowloads = soup.find("div", attrs={"class": "statitem downloads"})
        views = views.text if views else 0
        dowloads = dowloads.text if dowloads else 0

        return views, dowloads

    # парсинг CyberLeninka
    def getData(self, result, query, currentPage, pageNumber, isLastPage, driver):

        url = "https://cyberleninka.ru/search?q=%s&page=%s"  % (query, pageNumber)
        href = "https://cyberleninka.ru/"

        #driver = webdriver.Chrome()
        driver.get(url)
        time.sleep(1)
        html = driver.page_source
        page = BeautifulSoup(html, "html.parser")  
        numberOfCitations = 0
        entry = page.find("ul", attrs={"id": "search-results"})
        
        isLastPage = True

        for entry1 in entry.find_all("li"):
            entry2 = entry1.find("h2", attrs={"class": "title"})
            title = self.getNormalizeStrTitle(entry2.text)
            url = href + entry2.a['href']
            type = utils.typeParseItem.Article.value
            author = self.getNormalizeStrAuthor(entry1.find("span").text)
            datePublished = entry1.find("span", attrs={"class": "span-block"}).text[0:4]
            views, dowloads = self.getViewsAndDowloadsCyberLink(url)
            #objDate = self.getNowDate()
            result.append({"title": title, "url": url, 'date': '', "type": type, "author": author, "numberOfCitations": numberOfCitations, "views": views, "dowloads": dowloads, "datePublished": datePublished, "theme": query.replace("+", " "), "rating": currentPage, "resource": utils.parseResourceText.CyberLeninka.value})
            isLastPage = False
        
        return isLastPage

    def getNormalizeStrAuthor(self, str):
        result = []
        str = str.split(',')
        for author in str:
            result.append(self.normalize_str(author))
        return result
          
    def getNormalizeStrTitle(self, str):
        return self.normalize_str(str)

    def getNumberNextPage(self, pageNumber):
        return pageNumber + 1

class PubMed(Parser):
    isUseWebdriver = False
    startPageNumber = 1

    def __init__(self):
        pass

    # парсинг PubMed (англ запросы)
    def getData(self, result, query, currentPage, pageNumber, isLastPage, driver):

        url = "https://pubmed.ncbi.nlm.nih.gov/?term=%s&page=%s" % (query, pageNumber)
        href = "https://pubmed.ncbi.nlm.nih.gov"
        soup = requests.get(url)
        page = BeautifulSoup(soup.text, 'lxml') 

        isLastPage = True

        for entry in page.find_all("article", attrs={"class": "full-docsum"}):
            entry1 = entry.find("a", attrs={"class", "docsum-title"})
            title = self.getNormalizeStrTitle(entry1.text.strip())
            url = href + entry1['href']
            author = self.getNormalizeStrAuthor(entry.find("span", attrs={"class", "docsum-authors full-authors"}).text)
            datePublished = self.getDatePublished(entry.find("span", attrs={"class", "docsum-journal-citation full-journal-citation"}).text)
            type = utils.typeParseItem.Article.value
            #objDate = self.getNowDate()
            result.append({"title": title, "url": url, 'date': '', "type": type, "author": author, "numberOfCitations": 0, "views": 0, "dowloads": 0, "datePublished": datePublished, "theme": query.replace("+", " "), "rating": currentPage, "resource": utils.parseResourceText.PubMed.value})
            isLastPage = False
        
        return isLastPage

    def getNormalizeStrAuthor(self, str):
        result = []
        str = str.split(',')
        for author in str:
            result.append(self.normalize_str(author))
        return result
          
    def getNormalizeStrTitle(self, str):
        return self.normalize_str(str)

    def getNumberNextPage(self, pageNumber):
        return pageNumber + 1

class Frontiersin(Parser):
    isUseWebdriver = True
    startPageNumber = 0

    def __init__(self):
        pass

    # парсинг Frontiersin (англ запросы)
    def getData(self, result, query, currentPage, pageNumber, isLastPage, driver):

        url = 'https://www.frontiersin.org/search?query=' + query + '&tab=articles&origin=https%3A%2F%2Fwww.frontiersin.org%2F'  
        href = "https://pubmed.ncbi.nlm.nih.gov"
    
        #driver = webdriver.Chrome()
        driver.get(url)
        time.sleep(10)
        html = driver.page_source
        page = BeautifulSoup(html, "html.parser")

        entry = page.find("ul", attrs={"class": "entities-list articles"})
        for entry1 in entry.find_all("a"):
            author = []
            entry2 = entry1.find("div", attrs={"class": "title"})
            if entry2:
                title = self.getNormalizeStrTitle(entry2.text)
                #print("title: ", title)
                entry2 = page.find("ul", attrs={"class": "authors"})
                for aut in entry2.find_all("li"):
                    author.append(self.getNormalizeStrAuthor(aut.text))
                #print(author)
                entry2 = page.find("div", attrs={"class": "date"})
                datePublished = entry2.find("span").text
                datePublished = datePublished[len(datePublished)-5:len(datePublished)]
                #print(datePublished)
                views = page.find("li", attrs={"class": "impact-views"}).find("span", attrs={"class": "number"}).text
                dowloads = page.find("li", attrs={"class": "impact-downloads"}).find("span", attrs={"class": "number"}).text
                numberOfCitations = page.find("li", attrs={"class": "impact-citations"}).find("span", attrs={"class": "number"}).text
                #print(views, dowloads, numberOfCitations)
                url = url # там че то нет ссылки
                type = utils.typeParseItem.Article.value
                #objDate = self.getNowDate()
                result.append({"title": title, "url": url, 'date': '', "type": type, "author": author, "numberOfCitations": numberOfCitations, "views": views, "dowloads": dowloads, "datePublished": datePublished, "theme": query.replace("+", " "), "rating": currentPage, "resource": utils.parseResourceText.Frontiersin.value})
                
        return True

    def getNormalizeStrAuthor(self, str):
        return self.normalize_str(str)
          
    def getNormalizeStrTitle(self, str):
        return self.normalize_str(str)

    def getNumberNextPage(self, pageNumber):
        return pageNumber + 1

def main():
    agent = MobileAgent(utils.parseResource.GoogleSearch, "палинология")
    result = agent.start()

#if __name__ == "__main__":
#    main()
        