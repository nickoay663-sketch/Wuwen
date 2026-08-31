import Dictionary from "./Dictionary.js";
import Definitions from "../definitions/index.js";

import SpanishDictionary from "../languages/es-ES/Dictionary.js";
import SpanishDefinitions from "../languages/es-ES/Definitions.js";

class LanguageManager {

    static getResources(language) {

        switch (language) {

            case "es-ES":

                return {

                    dictionary: SpanishDictionary,

                    definitions: SpanishDefinitions

                };

            case "zh-CN":

            default:

                return {

                    dictionary: Dictionary,

                    definitions: Definitions

                };

        }

    }

}

export default LanguageManager;
