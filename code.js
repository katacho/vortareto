'use strict';


document.addEventListener('DOMContentLoaded', function () {

//Web Storage
class MyStorage {
    constructor(app) {
        this.app = app;
        this.storage = localStorage;
        this.data = JSON.parse(this.storage[this.app] || '{}');
    }

    getItem(key) {
        return this.data[key];
    }

    setItem(key, value) {
        this.data[key] = value;
    }

    deleteItem(key) {
        delete this.data[key];
    }

    deleteStorage() {
        localStorage.removeItem(this.app);
    }

    save() {
        this.storage[this.app] = JSON.stringify(this.data);
    }
}


    const startBtn = document.getElementById('startBtn');
    const editBtn = document.getElementById('editBtn');
    const answerBtn = document.getElementById('answerBtn');
    const retryBtn = document.getElementById('retryBtn');
    const newBtn = document.getElementById('newBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const finishBtn = document.getElementById('finishBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const makeBtn = document.getElementById('makeBtn');;
    const configBtn = document.getElementById('configBtn');
    const doneBtn = document.getElementById('doneBtn');


    const quizText = document.getElementById('quizText');
    const answerText = document.getElementById('answerText');

    const dataArea = document.getElementById('dataArea');

    const inputBox = document.getElementById('inputBox');
    const nameBox = document.getElementById('nameBox');

    const inputForm = document.getElementById('inputForm');

    const juliCheck = document.getElementById('juliCheck');
    const esCheck = document.getElementById('esCheck');
    const storageCheck = document.getElementById('storageCheck');

    const checkIcon1 = document.getElementById('checkIcon1');
    const checkIcon2 = document.getElementById('checkIcon2');

    const setSelect = document.getElementById('setSelect');

    const placeholderDiv = document.getElementById('placeholderDiv');

    let storage = new MyStorage('vortareto');

    function isEmpty(obj) {
        return !Object.keys(obj).length;
    }


    if (!('set' in storage.data) || isEmpty(storage.getItem('set'))) {
        const sampleData = 'aĉeti	買う\nakvo	水\namiko	友人\natendi	待つ\nbona	良い\nbuŝo	口\ndemandi	質問する\nmondo	世界\nprunti	貸し借りする\nridi	笑う';
        storage.setItem('set', { 'specimeno(10 vortoj)': sampleData });
    }
    if ('save' in storage.data && storage.getItem('save') === true) {
        storageCheck.checked = true;
    } else {
        storageCheck.checked = false;
    }

    dataArea.onchange = () => {
        Display.changePlaceholder();
    }

    dataArea.onkeyup = () => {
        Display.changePlaceholder();
    }

    placeholderDiv.onclick = () => {
        dataArea.focus();
    }

    let dictionary = [];
    let quiz = [];
    let wrong;//現在の問題で間違えたか
    let answerCount;    //現在連続1回だけ正解している単語
    let selectKey = 'unselected';

    const ICON_NAME = { unchecked: 'check_box_outline_blank', checked: 'check_box' };

    const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const convertToEs = (str) => {//代用表記を変換
        const sub = {
            c: 'ĉ', g: 'ĝ', h: 'ĥ', j: 'ĵ', s: 'ŝ', C: 'Ĉ', G: 'Ĝ', H: 'Ĥ', J: 'Ĵ', S: 'Ŝ'
        };
        let newStr = str + '';
        for (let key in sub) {
            newStr = newStr.replace(new RegExp(key + 'x' + '|' + key + '\\^', 'g'), sub[key]);
        }
        return newStr;
    }

    const getRandomInt = (max) => { //0からmax - 1までの整数
        return Math.floor(Math.random() * Math.floor(max));
    }

    const changeFont = (name) => {
        document.body.style.fontFamily = name;
    }

    const judge = () => {   //入力された文字が正しいか判定
        if (esCheck.checked === true) {
            return (convertToEs(inputBox.value) === quiz[0].term);
        } else {
            return (quiz[0].term === inputBox.value);
        }
    }

    const splitSetString = (str) => {
        dictionary = [];
        for (let data of str.split('\n')) {
            //テキストエリアから辞書を作成
            let [term, meaning] = data.split(/\s+/);
            if (!term || !meaning) {
                if (!term && !meaning) {
                    continue;
                } else {
                    return false;
                }
            }
            dictionary.push(new Word(term, meaning));
        }
        return true;
    }

    const changeSelectValue = (value) => {  //valueでオプションを選択
        for (let option of setSelect.options) {
            if (option.value === value) {
                option.selected = true;
                break;
            }
        }
    }

    class Word {
        constructor(term, meaning) {
            this.term = term;
            this.meaning = meaning;
            this.count = 0; //連続正解の回数
        }

        increaseCount() {
            this.count++;
        }

        resetCount() {
            this.count = 0;
        }
    }

    class Display {
        static changeSceneDisplay(scene) {
            const SCENE_DIV = {
                'ready': document.getElementById('readyDiv'),
                'edit': document.getElementById('editDiv'),
                'quiz': document.getElementById('quizDiv'),
                'result': document.getElementById('resultDiv'),
                'config': document.getElementById('configDiv')
            }

            if (scene === 'config') {
                configBtn.style.display = 'none';
            } else {
                configBtn.style.display = 'inline';
            }

            switch (scene) {
                case 'ready':
                    changeSelectValue(selectKey);
                    break;
                case 'edit':
                    nameBox.value = selectKey;
                    deleteBtn.style.display = 'inline';
                    break;
                case 'make':
                    deleteBtn.style.display = 'none';
                    break;
                case 'quiz':
                    break;
                case 'result':
                    break;
                case 'config':
                    break;
            }

            for (let key in SCENE_DIV) {
                if (scene === 'make') {
                    SCENE_DIV[key].style.display = (key === 'edit' ? 'block' : 'none');
                } else {
                    SCENE_DIV[key].style.display = (key === scene ? 'block' : 'none');
                }
            }
        }

        static updateQuiz(hideAnswer) {
            inputBox.style.borderColor = '#414141';
            if (hideAnswer !== true) {
                Display.correctAnswer();
            }
            inputBox.value = '';
            quizText.textContent = quiz[0].meaning;
            if (quiz[0].count == 0) {
                checkIcon1.innerHTML = ICON_NAME['unchecked'];
                checkIcon2.innerHTML = ICON_NAME['unchecked'];
            } else {
                checkIcon1.innerHTML = ICON_NAME['checked'];
                checkIcon2.innerHTML = ICON_NAME['unchecked'];
            }
            inputBox.focus();
        }

        static timer = null;
        static wrongAnswer() {
            inputBox.style.borderColor = 'rgb(228, 106, 132)';
            clearTimeout(this.timer);
            answerText.textContent = quiz[0].term;
            answerText.style.color = ' rgb(228, 106, 132)';
            answerText.style.visibility = 'visible';
            answerText.animate({ opacity: [0, 1] }, 300);
        }

        static correctAnswer() {
            answerText.textContent = 'Bone!';
            answerText.style.color = 'rgb(158, 236, 158)';
            answerText.style.visibility = 'visible';
            this.timer = setTimeout(() => { answerText.style.visibility = 'hidden'; }, 300);
        }

        static updateSetSelect() {
            while (setSelect.lastChild.value !== 'unselected') {
                setSelect.removeChild(setSelect.lastChild);
            }
            for (let key in storage.getItem('set')) {
                let option = document.createElement("option");
                option.text = key;
                option.value = key;
                setSelect.appendChild(option)
            }
        }

        static changePlaceholder() {
            let letterLength = dataArea.value.length;
            if (letterLength !== 0) {
                placeholderDiv.style.display = 'none';
            } else {
                placeholderDiv.style.display = 'block';
            }
        }

    }

    class SceneManeger {
        static nowScene = 'ready';

        static changeScene(scene) {
            if ((scene === 'edit' || scene == 'quiz') && selectKey === 'unselected') {
                alert('Bonvolu elekti aron.');
                return;
            }
            this.nowScene = scene;
            switch (scene) {
                case 'ready':
                    Display.updateSetSelect();
                    break;
                case 'edit':
                    dataArea.value = storage.getItem('set')[selectKey];
                    nameBox.value = selectKey;
                    Display.changePlaceholder();
                    break;
                case 'make':
                    dataArea.value = '';
                    nameBox.value = '';
                    Display.changePlaceholder();
                    break;
                case 'quiz':
                    wrong = false;
                    answerCount = 0;
                    dictionary = [];
                    quiz = [];

                    splitSetString(storage.getItem('set')[selectKey]);

                    //シャッフルして問題作成
                    quiz = shuffle(dictionary);
                    shuffle(quiz);
                    Display.updateQuiz(true);

                    break;
                case 'result':
                    resultDiv.style.display = 'block';
                    quizDiv.style.display = 'none';
                    break;
                case 'config':

                    break;

            }
            Display.changeSceneDisplay(scene);
        }
    }

    startBtn.onclick = () => {
        SceneManeger.changeScene('quiz');
    }

    inputForm.onsubmit = () => {
        if (wrong === false) {//まだ間違えていないのなら
            if (judge() === true) { //答えあってたら
                quiz[0].increaseCount();
                const movedQuiz = quiz[0];
                quiz.shift();
                if (movedQuiz.count === 2) {
                    answerCount--;
                } else {
                    quiz.splice(quiz.length - getRandomInt(answerCount + 1), 0, movedQuiz);
                    answerCount++;
                }
                if (quiz.length === 0) {
                    //クリアしたときの処理
                    SceneManeger.changeScene('result');
                } else {
                    Display.updateQuiz(false);
                }
            } else {
                if (quiz[0].count === 1) {
                    answerCount--;
                }
                quiz[0].resetCount();
                Display.updateQuiz(false);
                Display.wrongAnswer();
                wrong = true;
            }
        } else {
            if (judge() === true) {
                const movedQuiz = quiz[0];
                quiz.shift();
                const span = 5; //内部的にデータセットを分割する数
                if (quiz.length > span) {
                    quiz.splice(span + getRandomInt(Math.min(span, quiz.length - span)), 0, movedQuiz); //6番目から11番目のどれかへ移動
                } else {
                    quiz.splice(getRandomInt(quiz.length) + 1, 0, movedQuiz);//ランダムに問題を移動
                }
                wrong = false;
                Display.updateQuiz(false);
            }
        }
        return false;
    }

    juliCheck.onchange = () => {
        if (juliCheck.checked) {
            changeFont('Juliamo');
        } else {
            changeFont('Meiryo');
        }
    }

    storageCheck.onchange = () => {
        if (storageCheck.checked) {
            storage.setItem('save', true);
            storage.save();
        } else {
            storage.deleteStorage();
        }
    }

    newBtn.onclick = () => {
        SceneManeger.changeScene('ready');
    }

    retryBtn.onclick = () => {
        SceneManeger.changeScene('quiz');
    }


    editBtn.onclick = () => {
        SceneManeger.changeScene('edit');
    }

    finishBtn.onclick = () => {
        if (!splitSetString(dataArea.value)) {    //無効なフォーマット
            alert('Ĉi tiu teksto estas malvalida.');
            return;
        }
        if (!nameBox.value) {//名前が空
            alert('Bonvolu enigi la nomon de ĉi tiu aro.');
            return;
        }
        if (nameBox.value in storage.getItem('set')) {//名前が既に存在する
            if ((SceneManeger.nowScene === 'make') || ((SceneManeger.nowScene === 'edit') && (selectKey !== nameBox.value))) {//作成シーンまたは（編集シーンでかつ名前を変更している）
                alert('La nomo jam estas uzata.');
                return;
            }
        }
        if (SceneManeger.nowScene === 'edit') {
            delete storage.getItem('set')[selectKey];
            if (storageCheck.checked) {
                storage.save();
            }
        }
        storage.getItem('set')[nameBox.value] = dataArea.value;
        if (storageCheck.checked) {
            storage.save();
        }
        selectKey = nameBox.value;
        SceneManeger.changeScene('ready');
    }

    cancelBtn.onclick = () => {
        SceneManeger.changeScene('ready');
    }

    deleteBtn.onclick = () => {
        delete storage.getItem('set')[selectKey];
        if (storageCheck.checked) {
            storage.save();
        }
        selectKey = 'unselected';
        SceneManeger.changeScene('ready');
    }

    makeBtn.onclick = () => {
        SceneManeger.changeScene('make');
    }

    setSelect.onchange = () => {
        selectKey = setSelect.value;
    }


    configBtn.onclick = () => {
        SceneManeger.changeScene('config');

    }

    doneBtn.onclick = () => {
        SceneManeger.changeScene('ready');
    }
    alert('ba');
    //SceneManeger.changeScene('ready');
});

