import httpClient from './httpClient';

const END_POINT = 'https://wordsapiv1.p.rapidapi.com/words/';

const getWordDefinition = (word) => httpClient.get(END_POINT + word + '/definitions');
const getWordSynonyms = (word) => httpClient.get(END_POINT + word + '/synonyms');
const getWordAntonyms = (word) => httpClient.get(END_POINT + word + '/antonyms');
const getWordExampleUseCases = (word) => httpClient.get(END_POINT + word + '/examples');
const getMoreSpecificWordsForThaTWord = (word) => httpClient.get(END_POINT + word + '/hasTypes');

export {
    getWordDefinition,
    getWordSynonyms,
    getWordAntonyms,
    getWordExampleUseCases,
    getMoreSpecificWordsForThaTWord,
}