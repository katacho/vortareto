'use strict';

document.addEventListener('DOMContentLoaded', function () {

    let readyDiv = document.getElementById('readyDiv');
    let quizDiv = document.getElementById('quizDiv');

    let startButton = document.getElementById('startButton');
    let answerButton = document.getElementById('answerButton');
    let quizText = document.getElementById('quizText');
    let wordData = document.getElementById('wordData');
    let inputBox = document.getElementById('inputBox');
    let inputForm = document.getElementById('inputForm');
    let juliCheck = document.getElementById('juliCheck');
    let esCheck = document.getElementById('esCheck');
    let checkIcon1 = document.getElementById('checkIcon1');
    let checkIcon2 = document.getElementById('checkIcon2');
    let answerText = document.getElementById('answerText');
    let resultDiv = document.getElementById('resultDiv');
    let retryButton = document.getElementById('retryButton');
    let newButton = document.getElementById('newButton');
    

    let dictionary = [];
    let quiz = [];
    let wrong = false;//現在の問題で間違えたか
    let answerCount = 0;    //現在連続1回だけ正解している単語
    const sub = {
        'ĉ': 'c', 'ĝ': 'g', 'ĥ': 'h', 'ĵ': 'j', 'ŝ': 's', 'Ĉ': 'C', 'Ĝ': 'G', 'Ĥ': 'H', 'Ĵ': 'J', 'Ŝ': 'S'
    };

    const googleIconName = { unchecked: 'check_box_outline_blank', checked: 'check_box' };

    function convertToEs(str) {//代用表記を変換
        let newStr = str + '';
        for (let key in sub) {
            newStr = newStr.replace(new RegExp(sub[key] + 'x' + '|' + sub[key] + '\\^', 'g'), key);
            //newStr = newStr.replace(/cx|c\^/g, 'ĉ');
        }
        return newStr;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function changeFont(name) {
        document.body.style.fontFamily = name;
    }
    const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    class Word {
        constructor([term, meaning]) {
            this.term = term;
            this.meaning = meaning;
            this.count = 0; //連続正解の回数
        }
    }

    function updateDisplay() {
        answerText.style.visibility = 'hidden';
        inputBox.value = '';
        quizText.textContent = quiz[0].meaning;
        answerText.textContent = quiz[0].term;
        if (quiz[0].count == 0) {
            checkIcon1.innerHTML = googleIconName['unchecked'];
            checkIcon2.innerHTML = googleIconName['unchecked'];
        } else {
            checkIcon1.innerHTML = googleIconName['checked'];
            checkIcon2.innerHTML = googleIconName['unchecked'];           
        }
    }

    function judge() {
        if (esCheck.checked === true) {
            return (convertToEs(inputBox.value) === quiz[0].term);
        } else {
            return (quiz[0].term === inputBox.value);
        }
    }

    startButton.onclick = function () {
        readyDiv.style.display = 'none';
        quizDiv.style.display = 'inline';

        //テキストエリアから辞書を作成
        for (let data of wordData.value.split('\n')) {
            dictionary.push(new Word(data.split(/\s+/)));
        }

        //問題作成
        quiz = shuffle(dictionary);
        shuffle(quiz);
        updateDisplay();
    }

    inputForm.onsubmit = function () {
        //答えの判定
        if (wrong === false) {
            if (judge() === true) {
                quiz[0].count++;
                if (quiz[0].count === 2) {
                    answerCount--;
                } else {
                    quiz.splice(quiz.length - getRandomInt(answerCount), 0, quiz[0]);
                    answerCount++;
                }
                quiz.shift();
                if (quiz.length === 0) {
                    //クリアしたときの処理
                    resultDiv.style.display = 'block';
                    quizDiv.style.display = 'none';
                } else {
                    updateDisplay();
                }
            } else {
                if (quiz[0].count === 1) {
                    quiz[0].count = 0;
                    updateDisplay();
                    answerCount--;
                }
                wrong = true;
                answerText.style.color='#cc4646';
                answerText.style.visibility = 'visible';
                answerText.animate({ opacity: [0, 1] },300);
            }
        } else {
            if (judge() === true) {
                if (quiz.length >= 9) {
                    quiz.splice(9 + getRandomInt(Math.min(7, quiz.length - 8)), 0, quiz[0]); //8番目から15番目のどれかへ移動
                } else {
                    quiz.splice(getRandomInt(quiz.length) + 1, 0, quiz[0]);
                }
                quiz.shift();
                wrong = false;
                updateDisplay();
            }
        }
        return false;
    }

    juliCheck.onchange = function () {
        if (juliCheck.checked) {
            changeFont('Juliamo');
            
        } else {
            changeFont('Meiryo');
        }
    }

    retryButton.onclick = function () {
        
    }
});

