import Timer from './timer.js';

const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const decreaseTempoBtn = document.querySelector('.decrease-tempo');
const increaseTempoBtn = document.querySelector('.increase-tempo');
const tempoSlider = document.querySelector('.slider');
const startStopBtn = document.querySelector('.start-stop');
const subtractBeats = document.querySelector('.subtract-beats');
const addBeats = document.querySelector('.add-beats');
const measureCount = document.querySelector('.measure-count');

const click1 = new Audio('data:audio/mpeg;base64,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');
const click2 = new Audio('data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAHowCKioqKioqKioqKioqKioqKioqKtra2tra2tra2tra2tra2tra2trbY2NjY2NjY2NjY2NjY2NjY2NjY2O7u7u7u7u7u7u7u7u7u7u7u7u7u//////////////////////////8AAABQTEFNRTMuMTAwBLkAAAAAAAAAABUgJAauQQAB4AAAB6PvXRWuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vQxAAABpgBcbQAACPyMSy/OZBQIAABEDZij15QEDgnBwEAxB8ENZQ5E4PhjWDgYl6YnD8Tn8Mf4Pn8ufghIf/lHFwfg///8H6MkADIVBTAVB0ggqrI837DGYuMNFYwUEwIGDCQAMIiM00SjC4ZM7kkGBo4gPDCBTT1MVAhwzKYNHBCY6IRgRl/E/FURncmNVlV+LKKRQ6oAX+EELitMQLTAZi5FA9MQVUBpgcWYQsfZyrZnBrlN0L1ryguwnsnpN6gCHZp24ZdSIWnZa7M+41HQK+Qemn+jLlu1Wf93o1Wz1TXYMuZ32i2pLAEERaDbtLbzxpIZyjMxbjsQiz7VOU301NUo7MOwfNxGQRqVYVKWSal1Nnu5jWxwy/kp7dw/6b/lc9SyylkMatTV7VLKPr01yNSqrWu50tLlTUOvuc7/aWlwoWVvIagNLiJRb60UcUeU+ZpI4wxjhSBxKqytzEmDNJTrSdXq6oEhY6DzxwewgO2LGC5nCLzFMNZ6thGBUAiAiEIszX6c8PUKSo4aabU/c1uQjggMkPMm3wz3qD5OGhnVjxA/6Hf/+7q25G3q002/vWBwZUhbCGSNc2njP5XWAuQq5KyRuXlgqsQUKVHiYZS6IocoLKGTrhptLZdV3ZS7UTd3A0hQs+RUECMSrS2OqxyXiq63muQpIiqux/8WVtjHY5KZLrXWWfspSzqkzepH/sxMarDq0ttVJihqFh5UBEsalxf//y2OlVpRnEuUBUMbQKpFiTUOkWMRdrVe5BncocrnrvqCQRdIRlLmoDWYx8t6DBuWXNikOppKq9aJIw+AntXIK3vAMJhdF+vWIvbkV2eahyMFBtzxyRywIgtTe5TIBlPUp//zOnbNTDf9tNYbRvVOVjer2LOn17RFBcHT8kp/dprGBUJTLhLsi0lst0AAjw8ZMR5VUAxV4FCATFD1hJuQ4Oc6akICAwJjiSNyMjvlWRY0Xu7M7e74I8siCjAEcAzM1/1NQMq/+WaoSnhpgrUzSfVXwSb8YvTPedYkNTKkpkqmCriAABSFbCygy8FwQAuCpg2iBLBVCQiikGJoWsQqOwQsNE2LpSGaHOJ56loqJ42WiikXklmJdLp4//7YMT+AA9ErU+9lAAp+KfpPYSONCU6LVF5MuuiiijSpf/1Jf//9b+6MqtSjF1agZbussyI2zInDBUARlVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UMT5gA2E9T3sJM6hZRPmPYSZ1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+yDE9APMhd8bqQBeyAAAP8AAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxNYDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=');


let bpm = 140;
let beatsPerMeasure = 4;
let count = 0;
let isRunning = false;
let tempoTextString = 'Medium';

decreaseTempoBtn.addEventListener('click', () => {
    if (bpm <= 20) { return };
    bpm--;
    validateTempo();
    updateMetronome();
});
increaseTempoBtn.addEventListener('click', () => {
    if (bpm >= 280) { return };
    bpm++;
    validateTempo();
    updateMetronome();
});
tempoSlider.addEventListener('input', () => {
    bpm = tempoSlider.value;
    validateTempo();
    updateMetronome();
});

subtractBeats.addEventListener('click', () => {
    if (beatsPerMeasure <= 2) { return };
    beatsPerMeasure--;
    measureCount.textContent = beatsPerMeasure;
    count = 0;
});
addBeats.addEventListener('click', () => {
    if (beatsPerMeasure >= 12) { return };
    beatsPerMeasure++;
    measureCount.textContent = beatsPerMeasure;
    count = 0;
});

startStopBtn.addEventListener('click', () => {
    count = 0;
    document.querySelector('.circle1').style.cssText  = 'background-color:#fa545c; color:#fa545c';
    document.querySelector('.circle2').style.cssText  = 'background-color:#fa545c; color:#fa545c';
    document.querySelector('.circle3').style.cssText  = 'background-color:#fa545c; color:#fa545c';
    document.querySelector('.circle4').style.cssText  = 'background-color:#fa545c; color:#fa545c';
    if (!isRunning) {
        metronome.start();
        isRunning = true;
        startStopBtn.textContent = 'STOP';
    } else {
        metronome.stop();
        isRunning = false;
        startStopBtn.textContent = 'START';
    }
});

function updateMetronome() {
    tempoDisplay.textContent = bpm;
    tempoSlider.value = bpm;
    metronome.timeInterval = 60000 / bpm;
    if (bpm <= 40) { tempoTextString = "Super Slow" };
    if (bpm > 40 && bpm < 80) { tempoTextString = "Slow" };
    if (bpm > 80 && bpm < 120) { tempoTextString = "Getting there" };
    if (bpm > 120 && bpm < 180) { tempoTextString = "Nice and Steady" };
    if (bpm > 180 && bpm < 220) { tempoTextString = "Rock n' Roll" };
    if (bpm > 220 && bpm < 240) { tempoTextString = "Funky Stuff" };
    if (bpm > 240 && bpm < 260) { tempoTextString = "Relax Dude" };
    if (bpm > 260 && bpm <= 280) { tempoTextString = "Eddie Van Halen" };

    tempoText.textContent = tempoTextString;
}
function validateTempo() {
    if (bpm <= 20) { return };
    if (bpm >= 280) { return };
}

function playClick() {
    console.log(count);
    if (count === beatsPerMeasure) {
        count = 0;
    }
    
    updateColor();

    if (count === 0) {
        click1.play();
        click1.currentTime = 0;
        
    } else {
        click2.play();
        click2.currentTime = 0;
        }
    count++;
}
function updateColor() {
    console.log(count);
    switch(count){
    
    case 0: 
        document.querySelector('.circle1').style.cssText  = 'background-color:red; color:red';
        document.querySelector('.circle4').style.cssText  = 'background-color:#fa545c; color:#fa545c';
        break;
    case 1: 
        document.querySelector('.circle2').style.cssText  = 'background-color:red; color:red';
        document.querySelector('.circle1').style.cssText  = 'background-color:#fa545c; color:#fa545c';
        break;
    case 2: 
        document.querySelector('.circle3').style.cssText  = 'background-color:red; color:red';
        document.querySelector('.circle2').style.cssText  = 'background-color:#fa545c; color:#fa545c';
        break;
    case 3: 
        document.querySelector('.circle4').style.cssText  = 'background-color:red; color:red';
        document.querySelector('.circle3').style.cssText  = 'background-color:#fa545c; color:#fa545c';
        break;
    }

}

const metronome = new Timer(playClick, 60000 / bpm, { immediate: true });

