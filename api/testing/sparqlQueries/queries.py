# запрос на получение названий тестов и групп заданий
def getTestsNames():
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?nameTest ?groupTasks ?testObj " \
            "WHERE { " \
            "?testObj rdf:type tst:Тест. " \
            "?testObj tst:testName ?nameTest. " \
            "?testObj tst:has_group_of_task ?groupTasks. " \
            "}"
    return query

# запрос на получение названий курсов
def getCoursesNames():
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?courseName ?courseDescription ?courseObj ?courseInfo " \
            "WHERE { " \
            "?courseObj rdf:type tst:Курс. " \
            "?courseObj tst:nameCourse ?courseName. " \
            "?courseObj tst:descriptionCourse ?courseDescription. " \
            "?courseObj tst:infoCourse ?courseInfo. " \
            "}"
    return query

# запрос на получение заданий и их вопросов
def getTasksQuestions(groupTask):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?task ?questText ?taskType ?quest ?term ?template " \
            "WHERE { " \
            "?task tst:is_task_of tst:%s. " \
            "?task tst:task_has_question ?quest. " \
            "?task tst:hasTerm ?term. " \
            "?task tst:hasTerm ?term. " \
            "?quest tst:textQuestion ?questText. " \
            "?quest rdf:type ?taskType. " \
            "?taskType rdfs:subClassOf ?obj " \
            "}" % (groupTask)
    return query

# запрос на получение шаблона для задания
def getTemplateByTask(taskObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?template " \
            "WHERE { " \
            "tst:%s tst:task_has_template ?template. " \
            "}" % (taskObj)
    return query

# запрос на получение выделенных концептов для задания
def getSelectedTerms(taskObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?term " \
            "WHERE { " \
            "tst:%s tst:task_has_term ?term. " \
            "}" % (taskObj)
    return query

# запрос на получение ответов на задание
def getAnswersByTask(taskObj, groupTask):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?answObj ?answText " \
            "WHERE { " \
            "tst:%s tst:is_task_of ?%s. " \
            "tst:%s tst:task_has_answer ?answObj. " \
            "?answObj tst:textAnswer ?answText. " \
            "}" % (taskObj, groupTask, taskObj)
    return query

# запрос на получение правильных ответов на задание
def getCorrectAnswersByTask(taskObj, groupTask):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?answObj ?answText " \
            "WHERE { " \
            "tst:%s tst:is_task_of ?%s. " \
            "tst:%s tst:task_has_answer ?answObj. " \
            "?answObj tst:textAnswer ?answText. " \
            "?answObj tst:is_correct_answer_of ?corrects. " \
            "}" % (taskObj, groupTask, taskObj)
    return query

# запрос на получение пользователя
def getUsers():
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?userObj ?uid ?firstName ?lastName ?email ?role " \
            "WHERE { " \
            "?userObj rdf:type tst:Пользователь. " \
            "?userObj tst:uid ?uid. " \
            "?userObj tst:firstName ?firstName. " \
            "?userObj tst:lastName ?lastName. " \
            "?userObj tst:email ?email. " \
            "?userObj tst:role ?role. " \
            "}"
    return query

# запрос на получение попыток пользователя
def getAttempts(userObj, testObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?attemptObj ?percentComplete ?succesfull ?checked ?sumScore ?maxScore " \
            "WHERE { " \
            "tst:%s tst:has_attempt_to_pass_test ?attemptObj. " \
            "?attemptObj tst:relates_to_test tst:%s. " \
            "?attemptObj tst:percentCompleteOfTest ?percentComplete. " \
            "?attemptObj tst:succesfullAttempt ?succesfull. " \
            "?attemptObj tst:checked ?checked. " \
            "?attemptObj tst:sumScore ?sumScore. " \
            "?attemptObj tst:maxScore ?maxScore. " \
            "}" % (userObj, testObj)
    return query

# запрос на получение элементов теста попытки
def getTestElements(attemptObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?testElem " \
            "WHERE { " \
            "tst:%s tst:has_test_element ?testElem. " \
            "}" % (attemptObj)
    return query

# запрос на получение ответов элемента теста и их корректность
def getAnswersAndCorrectByTestElem(testElementObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?answerObj ?correct ?textAnswer ?score " \
            "WHERE { " \
            "tst:%s tst:has_answer ?answerObj. " \
            "?answerObj tst:rightAnswer ?correct. " \
            "?answerObj tst:textAnswer ?textAnswer. " \
            "?answerObj tst:score ?score. " \
            "}" % (testElementObj)
    return query

# запрос на получение текста ответа
def getTextAnswerByAnswer(answerObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?textAnswer " \
            "WHERE { " \
            "tst:%s tst:textAnswer ?textAnswer. " \
            "}" % (answerObj)
    return query

# запрос на получение курсов, на которые подписан студент
def getUserCourses(userObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?courseObj ?courseName ?courseDescription ?courseInfo " \
            "WHERE { " \
            "tst:%s tst:enrolled_course ?courseObj. " \
            "?courseObj tst:nameCourse ?courseName. " \
            "?courseObj tst:descriptionCourse ?courseDescription. " \
            "?courseObj tst:infoCourse ?courseInfo. " \
            "}" % (userObj)
    return query

# запрос на получение названия, описания , информации о курсе
def getNameDescrInfoCourse(courseObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?courseName ?courseDescription ?courseInfo " \
            "WHERE { " \
            "tst:%s tst:nameCourse ?courseName. " \
            "tst:%s tst:descriptionCourse ?courseDescription. " \
            "tst:%s tst:infoCourse ?courseInfo. " \
            "}" % (courseObj, courseObj, courseObj)
    return query

# запрос на получение студентов, подписанных на курс
def getStudentsCourse(courseObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?userObj ?uid " \
            "WHERE { " \
            "?userObj tst:enrolled_course tst:%s. " \
            "?userObj tst:uid ?uid. " \
            "}" % (courseObj)
    return query

# запрос на получение модулей у курса
def getModulesOfCourse(courseObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?moduleObj ?nameModule ?subArea " \
            "WHERE { " \
            "tst:%s tst:has_module ?moduleObj. " \
            "?moduleObj tst:nameModule ?nameModule. " \
            "?moduleObj tst:has_subject_area ?subArea. " \
            "}" % (courseObj)
    return query

# запрос на получение тестов у модуля
def getTestsOfModule(moduleObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?testObj ?testName ?groupTasks " \
            "WHERE { " \
            "tst:%s tst:has_test ?testObj. " \
            "?testObj tst:testName ?testName. " \
            "?testObj tst:has_group_of_task ?groupTasks. " \
            "}" % (moduleObj)
    return query

# запрос на получение лекций у модуля
def getLecturesOfModule(moduleObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?lectureObj ?lectureName " \
            "WHERE { " \
            "tst:%s tst:has_lecture ?lectureObj. " \
            "?lectureObj tst:lectureName ?lectureName. " \
            "}" % (moduleObj)
    return query

# запрос на получение терминов у области
def getTermsOfField(fieldObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?term ?prevTerm ?moveToPrev ?termNormalize " \
            "WHERE { " \
            "?term tst:isTermOf tst:%s. " \
            "?term tst:hasPrevTerm ?prevTerm. " \
            "?term tst:moveToPrev ?moveToPrev. " \
            "?term tst:termNormalize ?termNormalize. " \
            "}" % (fieldObj)
    return query

# запрос на получение термина у задания
def getTermByTask(taskObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?term " \
            "WHERE { " \
            "tst:%s tst:hasTerm ?term. " \
            "}" % (taskObj)
    return query

# запрос на получение терминов, которые студент знает
def getKnownTermsByUser(userObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?term ?subjectArea " \
            "WHERE { " \
            "tst:%s tst:knownTerm ?term. " \
            "?term tst:isTermOf ?subjectArea" \
            "}" % (userObj)
    return query

# запрос на получение терминов, которые студент знает
def getLecturesByTerm(term):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?lectureName ?lectureObj " \
            "WHERE { " \
            "?lectureObj tst:has_term tst:%s. " \
            "?lectureObj tst:lectureName ?lectureName. " \
            "}" % (term)
    return query

# запрос на получение терминов, которые студент знает
def getTemplates():
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?tempObj ?tempTitle ?tempProperty ?tempName " \
            "WHERE { " \
            "?tempObj tst:titleTemplate ?tempTitle. " \
            "?tempObj tst:nameTemplate ?tempName. " \
            "}"
    return query

# запрос на получение терминов, которые студент знает
def getUnknownTermsByUser(userObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?term ?subjectArea " \
            "WHERE { " \
            "tst:%s tst:unknownTerm ?term. " \
            "?term tst:isTermOf ?subjectArea" \
            "}" % (userObj)
    return query

# запрос на получение информации о концепте
def getInfoByTerm(termObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?templateObj ?answer " \
            "WHERE { " \
            "?answerObj tst:answ_has_term tst:%s. " \
            "?answerObj tst:answ_has_template ?templateObj. " \
            "}" % (termObj)
    return query

# запрос на получение информации о концепте
def getAnswersByTemplates():
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?templateObj ?termObj " \
            "WHERE { " \
            "?answerObj tst:answ_has_term ?termObj. " \
            "?answerObj tst:answ_has_template ?templateObj. " \
            "}"
    return query

# запрос на получение терминов, которые студент знает
def getAnswersByTaskAuto(template, concept):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?answerObj ?answer ?isMultipleAnswer " \
            "WHERE { " \
            "?answerObj tst:answ_has_term tst:%s. " \
            "?answerObj tst:answ_has_template tst:%s. " \
            "?answerObj tst:answer ?answer. " \
            "?answerObj tst:isMultipleAnswer ?isMultipleAnswer. " \
            "}" % (concept, template)
    return query

# запрос на получение предметных областей
def getSubjectAreas():
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?subArea " \
            "WHERE { " \
            "?subArea rdf:type tst:Область. " \
            "}"
    return query

# запрос на получение предметных областей
def getTemplatesByTerm(termObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?template " \
            "WHERE { " \
            "?answerObj tst:answ_has_term tst:%s. " \
            "?answerObj tst:answ_has_template ?template. " \
            "}" % termObj
    return query

# запрос на получение групп, на которые делится термин
def getGroupsByTerm(termObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?group " \
            "WHERE { " \
            "tst:%s tst:divided_in_groups ?group. " \
            "}" % (termObj)
    return query

# запрос на получение попыток для подсчета средней оценки по терминам
def getLastAttemptsForAverageScoreByUser(userObj):
    query = "PREFIX tst: <http://www.semanticweb.org/nike0/ontologies/2022/4/untitled-ontology-16#>" \
            "SELECT ?attempt ?test ?date ?testName " \
            "WHERE { " \
            "tst:%s tst:has_attempt_to_pass_test ?attempt. " \
            "?attempt tst:relates_to_test ?test. " \
            "?test tst:testName ?testName. " \
            "?attempt tst:dateAndTime ?date. " \
            "} ORDER BY (?test) DESC(?date)" % (userObj)
    return query