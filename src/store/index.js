import Vue from 'vue'
import Vuex from 'vuex'
import {
    getWordDefinition,
    getWordSynonyms,
    getWordAntonyms,
    getWordExampleUseCases,
    getMoreSpecificWordsForThaTWord
    } from "../httpClient/endpoints";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        definitions : {
            data : null,
            loadMore : false,
        },
        synonyms : {
            data : null,
            loadMore : false,
        },
        antonyms : {
            data : null,
            loadMore : false,
        },
        examples : {
            data : null,
            loadMore : false,
        },
        hyponyms : {
            data : null,
            loadMore : false,
        },
        errorMessage:  false,
        loading : false,

    },
    actions : {
         getWordInformation({ commit }, payload){
            commit("loading", true);
            commit("showError", false);
             //requests for all required information about the word;
             Promise.all(
                [getWordDefinition(payload),
                        getWordSynonyms(payload),
                        getWordAntonyms(payload),
                        getWordExampleUseCases(payload),
                        getMoreSpecificWordsForThaTWord(payload)])
                .then(results => {
                     //set definitions
                     commit("setWordDefinitions", results[0].data.definitions);
                     //set synonyms
                     results[1].data.synonyms.length !== 0 ? commit("setWordSynonyms", results[1].data.synonyms) : commit("setWordSynonyms", null);
                     //set antonyms
                     results[2].data.antonyms.length !== 0 ? commit("setWordAntonyms", results[2].data.antonyms) : commit("setWordAntonyms", null);
                     //set sentence examples
                     results[3].data.examples.length !== 0 ? commit("setExampleUses", results[3].data.examples) : commit("setExampleUses", null);
                     //set hyponyms
                     results[4].data['hasTypes'].length !== 0 ? commit("setMoreSpecificWordsForThatWord", results[4].data['hasTypes']) :
                     commit("setMoreSpecificWordsForThatWord", null);
                     commit("loading", false);
            })
        }
    },
    getters : {
        readMoreInformation : (state) => (payload) => {
            if (state[payload].data && !state[payload].loadMore && state[payload].data.length >= 5 ){
                return state[payload].data.slice(0, 5);
            }
            if (state[payload].loadMore) {
                state[payload].loadMore = false;
                return state[payload].data;
            }
            else {
                return state[payload].data;
            }
        },
        errorStatus : state => {
            return state.errorMessage;
        },
        loading : state => {
            return state.loading;
        }
    },
    mutations: {
        //todo refactor this commits to one function.
        setWordDefinitions (state, payload) {
            state.definitions.data = payload;
        },
        setWordSynonyms (state, payload) {
            state.synonyms.data = payload;
        },
        setWordAntonyms (state, payload) {
            state.antonyms.data = payload;
        },
        setExampleUses (state, payload) {
            state.examples.data = payload;
        },
        setMoreSpecificWordsForThatWord (state, payload) {
            state.hyponyms.data = payload;
            state.errorMessage = false;
        },
        showMoreInfo(state, payload){
            state[`${payload}`].loadMore = true;
        },
        showError(state, payload) {
            state.errorMessage = payload;
        },
        loading ( state, payload ) {
            state.loading = payload;
        }
    },
})
export default store;