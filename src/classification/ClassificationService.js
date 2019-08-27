// Imports the Google Cloud client library
const language = require('@google-cloud/language');
// Instantiates a client
const client = new language.LanguageServiceClient();

// [START translate_translate_text]
// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate');

// Creates a client
const translate = new Translate();


const PLAIN_TEXT = 'PLAIN_TEXT';
const JOIN_TOKEN = '({! @ # $})';

module.exports = class ClassificationService {

    async _translateToEnglish(text) {
        return this._translateToLanguage(text, 'en');
    }

    async _translateToLanguage(text, lang) {
        // Translates the text into the target language. "text" can be a string for
        // translating a single piece of text, or an array of strings for translating
        // multiple texts.
        let [translations] = await translate.translate(text, lang);
        translations = Array.isArray(translations) ? translations : [translations];
        console.log('Translations:');
        translations.forEach((translation, i) => {
            console.log(`${text[i]} => (${lang}) ${translation}`);
        });
        return translations[0];
    }

    async _detectLanguage(text) {
        // Detects the language. "text" can be a string for detecting the language of
        // a single piece of text, or an array of strings for detecting the languages
        // of multiple texts.
        let [detections] = await translate.detect(text);
        detections = Array.isArray(detections) ? detections : [detections];
        console.log('Detections:');
        detections.forEach(detection => {
            console.log(`${detection.input} => ${detection.language}`);
        });

        return detections[0].language;
    }

    /**
     * Classifies text by categories.
     * Google content classification works only with engilish language. 
     * See language support: https://cloud.google.com/natural-language/docs/languages
     * Because of it we translate source text to english, classify text and translate text back to source language.
     * 
     * @param   {string}           text
     *  
     * @returns {Array.<string>}   array of categories
     */
    async _classifyText(text) {
        let sourceLanguage = await this._detectLanguage(text);

        let translatedToEngText = await this._translateToEnglish(text);

        let document = {
            content: translatedToEngText,
            type: PLAIN_TEXT,
        };
        console.log(`Document: ${translatedToEngText}`);
        let answer = await client.classifyText({document})
                                    .then(([result]) => {
                                        console.log(result);
                                        return result.categories.map(elem => elem.name);
                                    });
        console.log('Classification: ', answer);

        let joins = Array.isArray(answer) ? answer : [answer];
        joins = joins.join(JOIN_TOKEN);

        answer = await this._translateToLanguage(joins, sourceLanguage);
        joins = Array.isArray(answer) ? answer[0] : answer;

        return joins.split(JOIN_TOKEN);
    }

    async classify({theme, body, question, answer, detailedAnswer}) {

        // let answerCategories = await this._classifyText(answer);
        let textCategories = await this._classifyText(body);

        return {
            answerCategories: "",
            textCategories
        };
    }
}