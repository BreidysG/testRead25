document.addEventListener('DOMContentLoaded', function() {
    const titleInit = document.getElementById("titleInit");
    const paragraphInit = document.getElementById("paragraphInit");
    const startButton = document.getElementById('startButton');
    const textContainer = document.getElementById('textContainer');
    const finishButton = document.getElementById('finishButton');
    const questionnaire = document.getElementById('questionnaire');
    const quizForm = document.getElementById('quizForm');
    const results = document.getElementById('results');
    const timerValue = document.getElementById('timerValue');
    let time = [];

    let wordCount = 0;
    let startTime, endTime;
    let quizCompleted = false;
    let timerInterval;

    // Texto para las preguntas del cuestionario
    const questions = [
        {
            question: "¿De qué trata la lectura?",
            answers: [
                "De una persona que desde niño lo único que le importaba era tener mucho dinero y por su avaricia murió y se fue al infierno",
                "Cuenta la historia de una persona que desde niño lo único que le importaba era tener mucho dinero y ayudar a otras personas por lo que al morir se fue al cielo",
                "De una persona que desde niño solo quiso tener dinero para ser el hombre más rico de su pueblo",
                "Es una persona que siempre tuvo dinero, pero su riqueza era por robos que hacía en su pueblo"
            ],
            correctAnswer: "De una persona que desde niño lo único que le importaba era tener mucho dinero y por su avaricia murió y se fue al infierno"
        },
        {
            question: "¿Con qué nombre era conocido el personaje principal?",
            answers: [
                "Chanchito",
                "Atún compás",
                "Mack Pato",
                "Tío Rico"
            ],
            correctAnswer: "Mack Pato"
        },
        {
            question: "¿Cómo calificaban al personaje?",
            answers: [
                "Ladrón, mentiroso, usurero",
                "Buena gente, amable",
                "Usurero, millonario, hablador",
                "Mentiroso, ganador, avispado"
            ],
            correctAnswer: "Ladrón, mentiroso, usurero"
        },
        {
            question: "¿Qué le dijo a Mack Pato, el hombre que ingresó al súper market?",
            answers: [
                "Que le prestara dinero",
                "Que se arrepintiera de sus pecados, porque iba a morir",
                "Que se fuera del pueblo porque lo iban a matar",
                "Que cuando se muriera toda la fortuna que tenía no se la podía llevar"
            ],
            correctAnswer: "Que se arrepintiera de sus pecados, porque iba a morir"
        },
        {
            question: "¿Por qué el destino de Mack Pato sería el infierno?",
            answers: [
                "Por su irreverencia, rebeldía, avaricia y no arrepentirse de sus pecados",
                "Por su buen comportamiento",
                "Por haberse escapado del pueblo debiendo dinero",
                "Por no haber dejado la fortuna a sus familiares"
            ],
            correctAnswer: "Por su irreverencia, rebeldía, avaricia y no arrepentirse de sus pecados"
        }
    ];
    
    
    
    // Función para contar las palabras en el texto
    function countWords(text) {
        return text.split(/\s+/).length;
    }

    // Función para calcular la velocidad de lectura (palabras por minuto)
    function calculateReadingSpeed(startTime, endTime, wordCount) {
        const minutes = (endTime - startTime) / 60000; // Convertir a minutos
        return Math.round(wordCount / minutes);
    }

    // Función para calcular el tiempo por palabra en milisegundos
    function calculateTimePerWord(ppm) {
        return Math.round(60000 / ppm); // ms por palabra
    }

    // Función para mostrar las preguntas del cuestionario
    function displayQuestions() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        questions.forEach((question, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p>${question.question}</p>
                <div class="question-options">
                    ${question.answers.map((answer, i) => `
                        <label>
                            <input type="radio" name="answer${index}" value="${answer}">
                            ${answer}
                        </label>
                    `).join('')}
                </div>
            `;
            questionList.appendChild(listItem);
        });
    }

    // Evento para comenzar el test al hacer clic en "Empezar"
    startButton.addEventListener('click', function() {
        textContainer.classList.remove('hidden');
        paragraphInit.classList.add("hidden");
        startButton.classList.add('hidden');
        startTime = Date.now();
        // Iniciar el contador
        timerInterval = setInterval(updateTimer, 1000);
    });

    // Función para actualizar el contador de tiempo
    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo transcurrido en segundos
        timerValue.textContent = currentTime;
        time.push(currentTime);
    }

    // Evento para finalizar el test al hacer clic en "Terminar Test"
    finishButton.addEventListener('click', function() {
        clearInterval(timerInterval); // Detener el contador
        titleInit.classList.add("hidden");
        textContainer.classList.add('hidden');
        finishButton.classList.add('hidden');
        endTime = Date.now();
        wordCount = countWords(document.getElementById('textToRead').textContent);
        const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount);
        questionnaire.classList.remove('hidden');
        displayQuestions();
    });

    // Evento para enviar el cuestionario
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!quizCompleted) {
            let anyAnswerSelected = true;

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (!selectedAnswer) {
                    anyAnswerSelected = false;
                    return;
                }
            });

            if (!anyAnswerSelected) {
                alert("Debes seleccionar una opción para cada pregunta antes de terminar.");
                return;
            }

            let correctAnswers = 0;
            let totalQuestions = questions.length;

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                    correctAnswers++;
                }
            });

            let comprehensionPercentage = (correctAnswers / totalQuestions) * 100;
            let timeResult = time[time.length-1];

            const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount); // Usar la velocidad de lectura real
            const timePerWordInMs = calculateTimePerWord(readingSpeed); // Ajustar el tiempo por palabra basado en la velocidad de lectura real
            
            quizCompleted = true;
            results.classList.remove('hidden');
            questionnaire.classList.add('hidden');
            document.getElementById('wordCountValue').textContent = wordCount;
            document.getElementById('readingSpeedValue').textContent = `${readingSpeed} palabras por minuto`;
            document.getElementById('comprehensionValue').textContent = `${comprehensionPercentage}`;
            document.getElementById('timeResultValue').textContent = `${timeResult} segundos`;

            // Mostrar tiempo por palabra ajustado
            document.getElementById('results').innerHTML += `
                <p class="lastParagrah">Toma nota de tu velocidad de lectura para poder realizar ajustes en los próximos ejercicios.</p>
                <p class="finalMessage">Puedes salir y pasar a la siguiente clase.</p>
                <p>Ajusta esta velocidad en tus ejercicios: ${timePerWordInMs} milisegundos por palabra</p>
            `;
        }
    });
});

