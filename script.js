function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(c.substring(nameEQ.length, c.length));
            }
            catch (e) {
                return [];
            }
        }
    }
    return null;
}

let quizQuestions = [
    { quizQuestion: "How Many Members Are In Currently SEVENTEEN?", answer: "13" },
    { quizQuestion: "How Many Members Are In Twice?", answer: "9" },
    { quizQuestion: "How Many Members Are Currently In fromis_9?", answer: "5" },
    { quizQuestion: "How Many Members Are In Currently tripleS?", answer: "24" },
];

let quizScore = 0;
let quizLength = quizQuestions.length;

document.addEventListener('DOMContentLoaded', () => {

    const dramaInput = document.getElementById('dramaInput');
    const dramaRatingInput = document.getElementById('dramaRatingInput');
    const addDramaButton = document.getElementById('addDramaButton');
    const dramaList = document.getElementById('dramaList');
    const quizResult = 0;

    let dramas = getCookie('dramas') || [];
    if (!dramas || dramas.length === 0) {
        dramas = [
            { name: 'Love Between Fairy and Devil', rating: 7 },
            { name: 'Love Between Lines', rating: 10 },
            { name: 'Overdo', rating: 5 },
        ];
        setCookie('dramas', JSON.stringify(dramas), 30);
    }

    function saveAndRenderDramas() {
        setCookie('dramas', JSON.stringify(dramas), 30);
        render();
    }

    function render() {
        dramas.sort((a, b) => b.rating - a.rating);
        dramaList.innerHTML = '';

        dramas.forEach((drama, index) => {
            const li = document.createElement('li');
            li.innerHTML = 
            `${drama.name} - Rating: <input type="number" class="rating-input" data-index="${index}" value="${drama.rating}" min="1" max="10"> <button class="delete-button" data-index="${index}">Delete</button>`;
            dramaList.appendChild(li);
        });

        quizQuestions.sort(() => Math.random() - 0.5);
        document.getElementById('quizQuestion').value = quizQuestions[0].quizQuestion;
    }

    function updateQuizScore() {
        document.getElementById('quizScore').textContent = `Quiz Score: ${quizScore}` + "/" + quizLength;
    }

    function updateQuizQuestion() {
        if (quizQuestions.length > 0) {
        document.getElementById('quizQuestion').value = quizQuestions[0].quizQuestion;
        } else {
            document.getElementById('quizQuestion').value = "End Of Quiz!";
            updateQuizScore();
        }
    }
    
    submitAnswerButton.addEventListener('click', () => {
        const userAnswer = quizAnswerInput.value.trim();
        const correctAnswer = quizQuestions[0].answer;

        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            quizScore++;
            quizQuestions.splice(0, 1);
            updateQuizQuestion();
        }

        else {
            quizQuestions.splice(0, 1);
            updateQuizQuestion();
        }
        quizAnswerInput.value = '';
    });

    addDramaButton.addEventListener('click', () => {
        const name = dramaInput.value.trim();
        const rating = parseInt(dramaRatingInput.value);

        if (name && !isNaN(rating) && rating >= 1 && rating <= 10) {
            if (dramas.some(drama => drama.name.toLowerCase() === name.toLowerCase())) {
                alert('This drama is already in the list.');
                return;
            }
            else {
                dramas.push({ name, rating });
            }
            saveAndRenderDramas();
            dramaInput.value = '';
            dramaRatingInput.value = '5';
        }
        else {
            alert('Please enter a valid drama name and a rating between 1 and 10.');
        }  
    });

    dramaList.addEventListener('change', (event) => {
        if (event.target.classList.contains('rating-input')) {
            const index = Number(event.target.getAttribute('data-index'));
            const newRating = parseInt(event.target.value);
            if (Number.isInteger(index) && dramas[index] && !isNaN(newRating) && newRating >= 1 && newRating <= 10) {
                dramas[index].rating = newRating;
                saveAndRenderDramas();
            }
            else {
                alert('Please enter a valid rating between 1 and 10.');
                render();
            }
        }
    });

    dramaList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const index = Number(event.target.getAttribute('data-index'));
            if (!Number.isInteger(index) || !dramas[index]) {
                return;
            }
            dramas.splice(index, 1);
            saveAndRenderDramas();
        }
    });

    render();
}); 