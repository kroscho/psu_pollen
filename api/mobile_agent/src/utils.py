from enum import Enum

# название ресурса
class parseResource(Enum):
    GoogleSearch = 1
    GoogleBooks = 2
    MicrosoftAcademic = 3
    CyberLeninka = 4
    PubMed = 5
    Frontiersin = 6

# название ресурса
class parseResourceText(Enum):
    GoogleSearch = "GoogleSearch"
    GoogleBooks = "GoogleBooks"
    MicrosoftAcademic = "MicrosoftAcademic"
    CyberLeninka = "CyberLeninka"
    PubMed = "PubMed"
    Frontiersin = "Frontiersin"

# тип найденной строки
class typeParseItem(Enum):
    Book = "Книга"
    Article = "Статья"
    Site = "Сайт"

# тип поиска (книги или статьи)
class typeData(Enum):
    Books = 1
    Articles = 2
    Sites = 3
    Authors = 4
    ActualData = 5