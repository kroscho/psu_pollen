from email import utils
from enum import Enum

#from testing.sparqlQueries.utils import getTokensFromTexts

class typeTemplate(Enum):
    Name = "1"                          # название чего то
    NameWithProperties = "2"            # название по каким то свойствам
    SubClasses = "3"                    # классы, подклассы, группы
    SubClassesWithProperties = "4"      # классы, подклассы, группы по признаку
    Definition = "5"                    # определение
    Relate = "6"                        # что то относится к чему то

class AutoGeneration:
    def __init__(self) -> None:
        self.templates = self.getTemplates()

    def getTemplates(self):
        templates = [
            {
                "type": typeTemplate.Name.value, 
                "text": "Как называется",
                "tokens": ['как', 'называться']
            },
            {
                "type": typeTemplate.NameWithProperties.value, 
                "text": "Как называется, которая",
                "tokens": ['как', 'называться', 'который'],
            },
            {
                "type": typeTemplate.SubClasses.value, 
                "text": "На какие группы, классы, слои, подклассы можно разделить, подразделить, поделить, делить",
                "tokens": ['на', 'какой', 'группа', 'класс', 'слой', 'подкласс', 'разделить', 'подразделить', 'поделить', 'делить'],
            },
            {
                "type": typeTemplate.Definition.value, 
                "text": "Что такое, дайте определение",
                "tokens": ['что', 'такой', 'дать', 'определение'],
            },
            {
                "type": typeTemplate.Relate.value,
                "text": "Что, группы, классы, слои, подклассы какие относится, принадлежит, характерны к",
                "tokens": ['что', 'какой', 'группа', 'класс', 'слой', 'подкласс', 'относиться', 'принадлежать', 'характерный'],
            },
            {
                "type": typeTemplate.SubClassesWithProperties.value, 
                "text": "На какие группы, классы, слои, подклассы можно разделить, поделить, делить по",
                "tokens": ['на', 'какой', 'группа', 'класс', 'слой', 'подкласс', 'разделить', 'поделить', 'подразделить', 'делить', 'по'],
            },
        ]
        '''
        for template in templates:
            tokens = getTokensFromTexts([template["text"]])
            print(tokens[0])
            template["tokens"] = tokens[0]
        '''
        return templates
    '''
    def toDetermineType(self, text):
        tokens = getTokensFromTexts([text])
        maxLen = 0
        typeTemp = ""
        print(tokens[0])
        print()
        for tokensTemplate in self.templates:
            listTemplates = list(filter(lambda i: i in tokens[0], tokensTemplate["tokens"]))
            print(listTemplates)
            if len(listTemplates) > maxLen:
                typeTemp = tokensTemplate["type"]
                maxLen = len(listTemplates)
        print(typeTemp)
        return typeTemp, tokens

'''
