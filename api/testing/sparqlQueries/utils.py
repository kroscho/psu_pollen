import difflib
import difflib
from lib2to3.pgen2 import token
#import nltk
import pymorphy2
import string

def getTypeTaskValue(typeStr):
    if typeStr == "Текстовый":
        return "1"
    elif typeStr == "Единственный":
        return "2"
    elif typeStr == "Множественный":
        return "3"
    else:
        return "4"

def checkCorrectAnswer(answer, correctsAnswers):
    for correct in correctsAnswers:
        if answer == correct:
            return True
    return False

def checkAnswer(trueTask, userTask):
    userAnswer = userTask['answer']
    if userTask['type'] != "3":
        for answer in trueTask['answers']:
            if answer['answer'] == userAnswer and answer['correct'] == True:
                return {"sum": 1, "answerObj": [answer["answerObj"]], "correct": [True]}
            elif answer['answer'] == userAnswer:
                return {"sum": 0, "answerObj": [answer["answerObj"]], "correct": [False]}
    else:
        result = {"sum": 0, "answerObj": [], "correct": []}
        if userTask['type'] != "1":
            correctAnswers = []
            allAnswers = []
            objAnswers = []
            for answer in trueTask['answers']:
                if answer['correct'] == True:
                    correctAnswers.append(answer['answer'])
                allAnswers.append(answer["answer"])
                objAnswers.append(answer['answerObj'])

            print("UserAnswers CorrectAnswers: ", userAnswer, correctAnswers)
            for userAnsw in userAnswer:
                if userAnsw in correctAnswers:
                    result["sum"] += 1
                    index = allAnswers.index(userAnsw)
                    result["answerObj"].append(objAnswers[index])
                    result["correct"].append(True)
                else:
                    result["sum"] -= 1
                    index = allAnswers.index(userAnsw)
                    result["answerObj"].append(objAnswers[index])
                    result["correct"].append(False)
            if result["sum"] <= 0:
                result["sum"] = 0
            else:
                result["sum"] = result["sum"] / len(correctAnswers)
            return result
        return {"sum": 0, "answerObj": [], "correct": []}

def similarity(s1, s2):
    normalized1 = s1.lower()
    normalized2 = s2.lower()
    matcher = difflib.SequenceMatcher(None, normalized1, normalized2)
    return matcher.ratio()

'''
stop_words = nltk.corpus.stopwords.words('russian')
stop_words += ['—']
stop_words += list(string.punctuation)
stop_words = set(stop_words)
stop_words.remove('по')
stop_words.remove('какой')

# токенизация текстов
def tokenized_texts(texts):
    tokenized_text = []
    for text in texts:
        tokens = nltk.word_tokenize(text)
        tokens = [i for i in tokens if (i not in string.punctuation)]
        tokens = [i for i in tokens if (i not in stop_words)]
        tokenized_text.append(tokens)

    return tokenized_text

def normalized_texts(texts):
    morph = pymorphy2.MorphAnalyzer()
    for text_i in range(len(texts)):
        for token_j in range(len(texts[text_i])):
            texts[text_i][token_j] = morph.parse(texts[text_i][token_j])[0].normal_form
    return texts

def getTokensFromTexts(texts):
    tokens = tokenized_texts(texts)
    tokens = normalized_texts(tokens)
    return tokens
'''
def findTermByName(name, terms):
    for t in terms:
        if t["term"] == name:
            return t
    return None

def getPrevTerm(term, terms):
    if term["moveToPrev"] == "True":
        t = findTermByName(term["prevTerm"], terms)
        return getPrevTerm(t, terms)
    else:
        return term
                
'''
def getTermFromText(tokens, terms):
    listTerms = []

    for word in tokens:
        for term in terms:
            if "_" in term["term"]:
                tokensTerm = getTokensFromTexts([term["term"].replace("_", " ")])
                if len(list(filter(lambda i: i in tokens, tokensTerm[0]))) == len(tokensTerm[0]):
                    term["similarity"] = 1.0
                    listTerms.append(term)
                    break
            else:
                simil = similarity(term["term"], word)
                if simil > 0.7:
                    term["similarity"] = simil
                    print(term["term"], word)
                    listTerms.append(term)
                if simil == 1.0:
                    break
    if listTerms:
        listTerms.sort(key=lambda x: x["similarity"], reverse=True)
        return getPrevTerm(listTerms[0], terms)
    else:
        return None
'''