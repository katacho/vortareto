'use strict';
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

document.addEventListener('DOMContentLoaded', function () {

    alert('ｘｘｘ');

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
    alert('o');
});

