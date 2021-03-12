<template>
  <div id="app" class="app" :class="{'light-mode' : lightMode, 'dark-mode': darkMode}" @click="removeTranslation">
      <header class="header">
          <a href="#!">
              <h1>DEFINITIONS</h1>
          </a>
          <span class="change-layout-color" @click="changeLayoutColor">
              {{currentMode}}
          </span>
      </header>
      <main></main>
      <footer></footer>
    <h2 ref="word" class="title">Write Any English Word And Press Enter To See It's Definition</h2>
    <input type="text" v-model="word" @keyup.enter="getWord" class="input" ref="input">
      <transition name="words">
      <div class="structure-wrapper" v-if="!loading">
          <section v-if="definitions && !errorStatus" class="definitions" :class="{'words-wrapper' : definitions}">
              <h3 >Definitions for "<strong>{{savedWord}}</strong>"</h3>
              <ul class="list-wrapper">
                  <li v-for="(definition, i) in definitions" :key="i" class="list-item">
                      <span @dblclick="selectWord(individualWord, Math.random())"  class="individual-word" v-for="(individualWord, i) in definition.definition.split(' ')" :key="i">
                            {{individualWord}}
                          <span v-if="selected.word === individualWord && selected.index === i" class="translation-word">
                              {{translatedWord}}
                          </span>
                      </span>
                  </li>
              </ul>
              <div v-if="definitions.length === 5" class="load-more-button" @click="showMoreInfoAboutWord('definitions')">LOAD MORE</div>
          </section>
          <section v-if="synonyms && !errorStatus" class="synonyms" :class="{'words-wrapper' : synonyms}">
              <h3 >Synonyms for "<strong>{{savedWord}}</strong>"</h3>
                  <ul class="list-wrapper">
                      <li v-for="(syn, i) in synonyms" :key="i" class="list-item">
                        <span @dblclick="selectWord(individualWord, i)"  class="individual-word" v-for="(individualWord, i) in syn.split(' ')" :key="i">
                            {{individualWord}}
                          <span v-if="selected.word === individualWord && selected.index === i" class="translation-word">
                              {{translatedWord}}
                          </span>
                      </span>
                      </li>
                  </ul>
              <div v-if="synonyms.length === 5" class="load-more-button"  @click="showMoreInfoAboutWord('synonyms')">LOAD MORE</div>
          </section>
          <section v-if="antonyms && !errorStatus" class="antonyms" :class="{'words-wrapper' : antonyms}">
            <h3 >Antonyms for "<strong>{{savedWord}}</strong>"</h3>
            <ul class="list-wrapper">
              <li v-for="(ant, i) in antonyms" :key="i" class="list-item">
                 <span @dblclick="selectWord(individualWord, i)"  class="individual-word" v-for="(individualWord, i) in ant.split(' ')" :key="i">
                        {{individualWord}}
                      <span v-if="selected.word === individualWord && selected.index === i" class="translation-word">
                          {{translatedWord}}
                      </span>
                  </span>
              </li>
            </ul>
              <div v-if="antonyms.length === 5" class="load-more-button" @click="showMoreInfoAboutWord('antonyms')">LOAD MORE</div>
          </section>
          <section v-if="examples && !errorStatus" class="examples" :class="{'words-wrapper' : examples}">
            <h3 >How to use word "<strong>{{savedWord}}</strong>" in a sentence</h3>
            <ul class="list-wrapper">
              <li v-for="(example, i) in examples" :key="i" class="list-item">
                 <span @dblclick="selectWord(individualWord, i)"  class="individual-word" v-for="(individualWord, i) in example.split(' ')" :key="i">
                        {{individualWord}}
                      <span v-if="selected.word === individualWord && selected.index === i" class="translation-word">
                          {{translatedWord}}
                      </span>
                 </span>
              </li>
            </ul>
              <div v-if="examples.length === 5" class="load-more-button" @click="showMoreInfoAboutWord('examples')">LOAD MORE</div>
          </section>
          <section v-if="hyponyms && !errorStatus" class="hyponyms" :class="{'words-wrapper' : hyponyms}">
            <h3 >Hyponims for "<strong>{{savedWord}}</strong>"</h3>
              <ul class="list-wrapper">
                <li v-for="(word, i) in hyponyms" :key="i" class="list-item">
                   <span @dblclick="selectWord(individualWord, i)"  class="individual-word" v-for="(individualWord, i) in word.split(' ')" :key="i">
                        {{individualWord}}
                      <span v-if="selected.word === individualWord && selected.index === i" class="translation-word">
                          {{translatedWord}}
                      </span>
                 </span>
                </li>
              </ul>
              <div v-if="hyponyms.length === 5" class="load-more-button" @click="showMoreInfoAboutWord('hyponyms')">LOAD MORE</div>
          </section>
      </div>
    <div class="lds-hourglass" v-if="loading && !errorStatus"></div>
    <div class="error-message" v-if="errorStatus">
        {{`Oops, looks like we don't know what " ${this.savedWord} " means`}}
    </div>
      </transition>
  </div>

</template>

<script>

import {mapGetters} from "vuex";
const {Translate} = require('@google-cloud/translate').v2;
import main from "./assets/style/main.scss"

export default {
  name: 'App',
  data() {
    return {
      word : "",
      savedWord : "",
      darkMode : false,
      lightMode : true,
      currentMode  : "DARK",
      translatedWord : "",
      selected : {
          word : "",
          index : "",
      }

    }
  },
  components: {
  },
  methods : {
      removeTranslation(){
          this.selected.word = null;
      },
      async selectWord(word, index){
            this.translatedWord = null;
            this.selected.word = word;
            this.selected.index = index;
            //instant google translation.
            const translate = new Translate({
                projectId : 'deductive-span-264818',
                key : "AIzaSyCVBu_OFhjWDcF_ZiKrEgljmbVTntDEoEY"
            });
            // The target language
            const target = 'ka';
            // Translates  text into Georgian
            const [translation] = await translate.translate(word, target);
            this.translatedWord = translation;
        },
       getWord(){
          this.$store.dispatch("getWordInformation", this.word);
          this.savedWord = this.word;
          this.word = "";
    },
      changeLayoutColor() {
        if (this.lightMode === true){
            this.lightMode = false;
            this.darkMode = true;
            this.currentMode = "LIGHT";
            localStorage.setItem("colorMode", this.currentMode);
            document.querySelector(".app").style.background = main['LIGHT'];

        }
        else if (this.lightMode === false){
            this.lightMode = true;
            this.darkMode = false;
            this.currentMode = "DARK";
            localStorage.setItem("colorMode", this.currentMode);
            document.querySelector(".app").style.background = main['DARK'];

        }
      },
      showMoreInfoAboutWord(type){
        this.$store.commit("showMoreInfo", type);
      }
  },
    mounted() {
      if (document.querySelector(".light-mode")) {
          main['color'] = "#1D2227";
      }
      this.$refs.input.focus();
      // if (localStorage.getItem("colorMode") === "LIGHT") {
      //     this.lightMode = false;
      //     this.darkMode = true;
      //     this.currentMode = "LIGHT";
      //     // set scss Global variables to some colors to change theme;
      // }
      // else {
      //     document.querySelector(".app").style.background = main['LIGHT'];
      // }
    },
    computed: {
        ...mapGetters(["readMoreInformation", "errorStatus", "loading"]),
        definitions : function () {
            return this.readMoreInformation("definitions");
        },
        synonyms : function () {
            return this.readMoreInformation("synonyms");
        },
        antonyms : function () {
            return this.readMoreInformation("antonyms");
        },
        examples : function () {
            return this.readMoreInformation("examples");
        },
        hyponyms : function () {
            return this.readMoreInformation("hyponyms");
        },
    }
}
</script>

<style lang="scss">
    $base-bg-color : #d1d1d3;
    $base-text-color : #1d2227;
    $base-border : #1d2227;

body {
    margin:0;
    -moz-user-select     : none;
    -webkit-user-select  : none;
    user-select          : none;

}

.individual-word {
    position: relative;
}

.error-message {
    position: relative;
    top: 200px;
}
.light-mode {
    $base-bg-color : #4a4e69;
    $base-text-color : #ffffff;
    $base-border : #1d2227;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $base-text-color;
    position: relative;
    min-height: 100vh;
    background: $base-bg-color;
    transition: all 200ms;
    padding-bottom: 30px;
    //styles
    .translation-word{
        position: absolute;
        bottom: 13px;
        left: -6px;
        display: block;
        min-width: 100%;
        height: 25px;
        line-height: 25px;
        padding: 0 5px;
        text-align: center;
        background: $base-text-color;
        color: $base-bg-color;
        border-radius: 5px;
    }
    .load-more-button {
        list-style: none;
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: 0;
        left: 0;
        line-height: 30px;
        background: $base-text-color;
        color: $base-bg-color;
        cursor: pointer;
        font-size: 11px;
    }
    .change-layout-color {
        position: absolute;
        right: 20px;
        top: 15px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background:$base-text-color;
        color: $base-bg-color ;
        font-size: 10px;
        line-height: 50px;
        font-weight: bold;
        cursor: pointer;
        border:1px solid transparent;
        transition: all 200ms;
        &:hover {
            background: $base-bg-color ;
            border:1px solid $base-text-color;
            transition: all 200ms;
            color: $base-text-color;
        }
    }

    .title {
        margin: 0;
        padding:25px 0;
    }
    .structure-wrapper {
        display: flex;
        align-items:flex-start;
        align-content:flex-start;
        margin-top: 50px;
    }
    .words-wrapper {
        box-sizing: border-box;
        position: relative;
        box-shadow: 0 0 2px 0 $base-text-color;
        flex-basis: 18%;
        margin: 0 10px;
        height: auto;
        h3 {
            padding: 0 5px;
        }
    }

    .lds-hourglass {
        width: 40px;
        height: 40px;
        display: flex;
        position: absolute;
        top: 300px;
        left: 0;
        right: 0;
        margin: 0 auto;
        justify-content: center;
    }
    .lds-hourglass:after {
        content: " ";
        display: block;
        border-radius: 50%;
        width: 0;
        height: 0;
        margin: 8px;
        box-sizing: border-box;
        border: 15px solid $base-text-color;
        border-color: $base-text-color transparent $base-text-color transparent;
        animation: lds-hourglass 1.2s infinite;
    }
    @keyframes lds-hourglass {
        0% {
            transform: rotate(0);
            animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
        50% {
            transform: rotate(900deg);
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        100% {
            transform: rotate(1800deg);
        }
    }

    .section {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .section h3 {
        margin-bottom: 0;
        font-size: 15px;
    }

    .list-wrapper {
        padding: 0 26px 40px;
        margin:0;
        list-style: decimal;
        position: relative;
    }
    .list-item {
        text-align: left;
        padding: 3px 0;
        font-size: 12px;
    }

    .answers-wrapper {
        max-width: 700px;
        margin: 50px auto 0;
        /*box-shadow: 0 0 5px 0;*/
        box-sizing: border-box;
        padding: 15px;
        height: 69vh;
        overflow-y: scroll;


    }
    .answers-wrapper::-webkit-scrollbar {
        display: none;
    }

    .input {
        width: 300px;
        height: 40px;
        font-size: 28px;
        outline: none;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 0 4px;
        border: 1px solid $base-text-color;
        background: $base-bg-color;
        color: $base-text-color;
    }
    .word {
        font-size: 148px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top:50%;
        transform: translateY(-50%);
    }
}
.dark-mode {
    $base-bg-color : #1d2227;
    $base-text-color : #f3f3f3;
    $base-border : #f3f3f3;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $base-text-color;
    position: relative;
    min-height: 100vh;
    background: $base-bg-color;
    transition: all 200ms;
    padding-bottom: 30px;
    //styles
    .translation-word{
        position: absolute;
        bottom: 13px;
        left: -6px;
        display: block;
        min-width: 100%;
        height: 25px;
        line-height: 25px;
        padding: 0 5px;
        text-align: center;
        background: $base-text-color;
        color: $base-bg-color;
        border-radius: 5px;
    }
    .load-more-button {
        list-style: none;
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: 0;
        left: 0;
        line-height: 30px;
        background: $base-text-color;
        color: $base-bg-color;
        cursor: pointer;
        font-size: 11px;
    }
    .change-layout-color {
        position: absolute;
        right: 20px;
        top: 15px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background:$base-text-color;
        color: $base-bg-color ;
        font-size: 10px;
        line-height: 50px;
        font-weight: bold;
        cursor: pointer;
        border:1px solid transparent;
        transition: all 200ms;
        &:hover {
            background: $base-bg-color ;
            border:1px solid $base-text-color;
            transition: all 200ms;
            color: $base-text-color;
        }
    }

    .title {
        margin: 0;
        padding:25px 0;
    }
    .structure-wrapper {
        display: flex;
        align-items:flex-start;
        align-content:flex-start;
        margin-top: 50px;
    }
    .words-wrapper {
        box-sizing: border-box;
        position: relative;
        box-shadow: 0 0 2px 0 $base-text-color;
        flex-basis: 18%;
        margin: 0 10px;
        height: auto;
        h3 {
            padding: 0 5px;
        }
    }

    .lds-hourglass {
        width: 40px;
        height: 40px;
        display: flex;
        position: absolute;
        top: 300px;
        left: 0;
        right: 0;
        margin: 0 auto;
        justify-content: center;
    }
    .lds-hourglass:after {
        content: " ";
        display: block;
        border-radius: 50%;
        width: 0;
        height: 0;
        margin: 8px;
        box-sizing: border-box;
        border: 15px solid $base-text-color;
        border-color: $base-text-color transparent $base-text-color transparent;
        animation: lds-hourglass 1.2s infinite;
    }
    @keyframes lds-hourglass {
        0% {
            transform: rotate(0);
            animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
        50% {
            transform: rotate(900deg);
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        100% {
            transform: rotate(1800deg);
        }
    }

    .section {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .section h3 {
        margin-bottom: 0;
        font-size: 15px;
    }

    .list-wrapper {
        padding: 0 26px 40px;
        list-style: decimal;
        margin: 0;
        position: relative;
    }
    .list-item {
        text-align: left;
        padding: 3px 0;
        font-size: 12px;
    }

    .answers-wrapper {
        max-width: 700px;
        margin: 50px auto 0;
        /*box-shadow: 0 0 5px 0;*/
        box-sizing: border-box;
        padding: 15px;
        height: 69vh;
        overflow-y: scroll;


    }
    .answers-wrapper::-webkit-scrollbar {
        display: none;
    }

    .input {
        width: 300px;
        height: 40px;
        font-size: 28px;
        outline: none;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 0 4px;
        border: 1px solid white;
        background: $base-bg-color;
        color: $base-text-color;
    }
    .word {
        font-size: 148px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top:50%;
        transform: translateY(-50%);
    }

}
@import "./assets/style/main.scss";



</style>
