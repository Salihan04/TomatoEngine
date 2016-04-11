export default class SpeechRecognition {
  static timeout_limit = 2000;
  static final_transcript = '';
  static recognizing = false;
  static keyword_detected = false;
  static ignore_onend;
  static start_timestamp;
  static recognition;
  static inputOnChange;
  static inputOnSubmit;
  static timer;
  static phrase = 'hello tomato';

	constructor() {
    throw "Error!";
  }

  static initialize(inputOnChange, inputOnSubmit) {
    console.log(inputOnChange);
    this.inputOnChange = inputOnChange;
    this.inputOnSubmit = inputOnSubmit;
    this.load();
  }

  static load() {
    if (!('webkitSpeechRecognition' in window)) {
      console.log('Speech API not found!');
    } else {
      console.log('Speech API found!');
      // start_button.style.display = 'inline-block';
      this.recognition = new window['webkitSpeechRecognition']();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.onstart = () => {
        this.recognizing = true;
        // start_img.src = 'mic-animate.gif';
      };
      this.recognition.onerror = (event) => {
        if (event.error == 'no-speech') {
          // start_img.src = 'mic.gif';
          this.ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          // start_img.src = 'mic.gif';
          this.ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - this.start_timestamp < 100) {
            // showInfo('info_blocked');
          } else {
            // showInfo('info_denied');
          }
          this.ignore_onend = true;
        }
      };
      this.recognition.onend = () => {
        this.recognizing = false;
        if (this.ignore_onend) {
          return;
        }
        // start_img.src = 'mic.gif';
        if (!this.final_transcript) {
          // showInfo('info_start');
          return;
        }
        // showInfo('');
        // if (window.getSelection) {
        //   window.getSelection().removeAllRanges();
        //   var range = document.createRange();
        //   range.selectNode(document.getElementById('final_span'));
        //   window.getSelection().addRange(range);
        // }
      };
      this.recognition.onresult = (event) => {
        const timestamp = (new Date()).getTime();
        if (!this.start_timestamp || (timestamp - this.start_timestamp > this.timeout_limit)) {
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this.submitQuery();
          this.start_timestamp = timestamp;
          this.keyword_detected = false;
        }

        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        // final_transcript = capitalize(final_transcript);
        console.log(interim_transcript, this.final_transcript);

        this.detectKeywords(interim_transcript, this.final_transcript);
        // final_span.innerHTML = linebreak(final_transcript);
        // interim_span.innerHTML = linebreak(interim_transcript);
        // if (final_transcript || interim_transcript) {
        //   showButtons('inline-block');
        // }
      };
    }
  }

  static submitQuery() {
    console.log('timeout!');
    this.final_transcript = this.final_transcript.trim();
    if (this.final_transcript !== '') {
      this.inputOnSubmit(this.final_transcript);
      this.final_transcript = '';
      this.stopRecognize();
      console.log(this.recognizing);
    }
  }

  static detectKeywords(interim_transcript, final_transcript) {
    let index = final_transcript.toLowerCase().indexOf(this.phrase);
    if (index !== -1) {
      console.log('OK tomato detected!');
      this.keyword_detected = true;
      this.final_transcript = final_transcript.substring(index + this.phrase.length).trim();
    }

    // if (this.keyword_detected) {
      this.inputOnChange((interim_transcript + ' ' + this.final_transcript).trim());
      // document.getElementsByClassName('sk-search-box__text')[0].value = 
        // interim_transcript + ' ' + this.final_transcript;
    // }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(this.submitQuery.bind(this), this.timeout_limit);
  }

  static stopRecognize() {
    this.recognition.stop();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  static startRecognize() {
    if (this.recognizing) {
      this.recognition.stop();
      return;
    }
    this.final_transcript = '';
    this.recognition.lang = 'en-US'
    this.recognition.start();
    this.ignore_onend = false;
    // final_span.innerHTML = '';
    // interim_span.innerHTML = '';
    // start_img.src = 'mic-slash.gif';
    // showInfo('info_allow');
    // showButtons('none');
    // start_timestamp = event.timeStamp;
  }
}



