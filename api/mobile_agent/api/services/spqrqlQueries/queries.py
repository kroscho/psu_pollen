
# запрос на получение данных по введенной строке
def getDataByNameQuery(property, title):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?title ?urlArticle" \
            "WHERE { " \
            "?title rdf:type pln:%s. " \
            "FILTER regex(lcase(STR(?title)), \"%s\")" \
            "}" % (property, title)
    return query

# запрос на получение данных, если строка поиска пустая
def getAllDataQuery(prop1, prop2):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?title ?rating " \
            "WHERE { " \
            "?title rdf:type pln:%s. " \
            "?title pln:%s ?rating" \
            "} " \
            "ORDER BY (?rating)" % (prop1, prop2)
    return query

# запрос на получение свойств у книги или статьи
def getPropertyForBookOrArticleQuery(prop1, prop2, prop3, prop4, prop5, prop6, prop7, prop8, title):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?theme ?author ?url ?numberOfCitations ?resourse ?views ?dowloads ?datePublished " \
            "WHERE { " \
            "pln:" + title + " pln:" + prop1 + " ?theme. " \
            "pln:" + title + " pln:" + prop2 + " ?author. " \
            "pln:" + title + " pln:" + prop3 + " ?url. " \
            "pln:" + title + " pln:" + prop4 + " ?numberOfCitations. " \
            "pln:" + title + " pln:" + prop5 + " ?resourse. " \
            "pln:" + title + " pln:" + prop6 + " ?views. " \
            "pln:" + title + " pln:" + prop7 + " ?dowloads. " \
            "pln:" + title + " pln:" + prop8 + " ?datePublished. " \
            "}"
    return query

# запрос на получение свойств у веб ресурса (нет авторов)
def getPropertyForWebResourseQuery(prop1, prop2, prop5, title):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?theme ?url ?resourse " \
            "WHERE { " \
            "pln:" + title + " pln:" + prop1 + " ?theme. " \
            "pln:" + title + " pln:" + prop2 + " ?url. " \
            "pln:" + title + " pln:" + prop5 + " ?resourse. " \
            "}"
    return query

# запрос на получение тем, на которые писал автор
def getAuthorThemesQuery(name, prop):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?theme " \
            "WHERE { " \
            "pln:" + name + " pln:" + prop + " ?theme." \
            "}"
    return query

# запрос на получение публикаций автора
def getAuthorItemsQuery(name, prop):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?item " \
            "WHERE { " \
            "pln:" + name + " pln:" + prop + " ?item." \
            "}"
    return query

# запрос на получение автора по имени
def getAuthorByNameQuery(name):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?author " \
            "WHERE { " \
            "?author rdf:type pln:Авторы. " \
            "FILTER regex(lcase(STR(?author)), " + "\"" + name + "\"" + ")" \
            "}"
    return query

# запрос на получение публикаций по теме
def getDataByThemesQuery(theme, prop1, prop2):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?title ?rating " \
            "WHERE { " \
            "?title pln:" + prop1 + " pln:" + theme + ". " \
            "?title pln:" + prop2 + " ?rating" \
            "} " \
            "ORDER BY (?rating)"
    return query

# запрос на получение авторов по теме
def getAuthorsByThemesQuery(theme, prop):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?author " \
            "WHERE { " \
            "?author pln:" + prop + " pln:" + theme + ". " \
            "} "
    return query

# запрос на получение актуальных данных за последние 3 дня
def getActualDataQuery(prop, date):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?title ?day " \
            "WHERE { " \
            "?title pln:" + prop + " ?day. " \
            "FILTER(?day > \"" + date + "\"^^xsd:dateTime). " \
            "} "
    return query

# запрос на получение данных, если строка поиска пустая
def getDataByDataPublishedQuery(prop1, prop2, prop3, year):
    query = "PREFIX pln: <http://www.semanticweb.org/nikita/ontologies/2021/7/untitled-ontology-112#>" \
            "SELECT ?title ?year " \
            "WHERE { " \
            "?title pln:%s ?year. " \
            "} " \
            "ORDER BY (?year)" % (prop2)
    return query