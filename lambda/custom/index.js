// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Launch Intent with welcoming message
const LaunchIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    // Welcome message and asks user for her/his name.
    const speakOutput = "Hi, I'm your deals assistant. I can keep track of products "
            + "you want to buy and notify you when the price drops. Before we get started, what is your name?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt()
      .getResponse();
  },
};

const NameIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'NameIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const request = handlerInput.requestEnvelope.request;
    const name = request.intent.slots.name.value;

    const speakOutput = "Thanks " + name
            + ". And what phone number would you like me to send the notification to?";

    const session = handlerInput.attributesManager.getSessionAttributes();
    session.customerName = name;
    handlerInput.attributesManager.setSessionAttributes(session);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt()
      .getResponse();
  },
};

const NotificationIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return (request.type === 'IntentRequest'
        && request.intent.name === 'NotificationIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const request = handlerInput.requestEnvelope.request;
    const phone = request.intent.slots.phone.value;
    const session = handlerInput.attributesManager.getSessionAttributes();

    const speakOutput = "Thanks " + session.customerName
            + ". I'll send my notifications to <say-as interpret-as=\"telephone\">" + phone + "</say-as>. What products would you like me to track?";


    session.phoneNumber = session.phoneNumber || phone;
    handlerInput.attributesManager.setSessionAttributes(session);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt()
      .getResponse();
  },
};

// Subscribe ASIN intent
const SubscribeIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest' ||
      (request.type === 'IntentRequest' && request.intent.name === 'SubscribeIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const request = handlerInput.requestEnvelope.request;
    const product = request.intent.slots.asin.value;

    var speakOutput = "";

    const item = itemData.find(obj => {return (obj.productName).toLowerCase() === product.toLowerCase()});
    if (item === undefined) {
      speakOutput = product + " could not be found. Please search for different items.";
    }
    else {
      subscribedItems.push({"productName":product.toLowerCase(), "price":0 });
      speakOutput = "I've found " + item.productName + " for " + item.price + " dollars. What is the highest price you want to pay?";
    }

    const session = handlerInput.attributesManager.getSessionAttributes();
    session.productDescription = product;
    handlerInput.attributesManager.setSessionAttributes(session);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt()
      .getResponse();
  },
};

// Modify ASIN intent
const ModifyThresholdIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest' ||
      (request.type === 'IntentRequest' && request.intent.name === 'ModifyThresholdIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const request = handlerInput.requestEnvelope.request;
    const product = request.intent.slots.asin.value;

    var speakOutput = "";

    const item = subscribedItems.find(obj => {return (obj.productName).toLowerCase() === product.toLowerCase()});
    if (item === undefined) {
      speakOutput = product + " could not be found from your list.";
    }
    else {
      speakOutput = "The current threshold for " + item.productName + " is " + item.price + " dollars. What is the most you want to pay?";
    }

    const session = handlerInput.attributesManager.getSessionAttributes();
    session.productDescription = product;
    handlerInput.attributesManager.setSessionAttributes(session);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt()
      .getResponse();
  },
};

// Unsubscribe ASIN intent
const UnsubscribeIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest' ||
      (request.type === 'IntentRequest' && request.intent.name === 'UnsubscribeIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const request = handlerInput.requestEnvelope.request;
    const product = request.intent.slots.asin.value;

    var speakOutput = "";

    const item = itemData.find(obj => {return obj.productName === product});
    if (item === undefined) {
      speakOutput = product + " could not be found from the list.";
    }
    else {
      speakOutput = "I removed " + item.productName + " from your list.";
    }

    const session = handlerInput.attributesManager.getSessionAttributes();
    session.productDescription = product;
    handlerInput.attributesManager.setSessionAttributes(session);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt()
      .getResponse();
  },
};

// Tell users which items are being tracked
const ListItemIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest' ||
      (request.type === 'IntentRequest' && request.intent.name === 'ListItemIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const request = handlerInput.requestEnvelope.request;

    const listSize = subscribedItems.length;
    var speakOutput = "";

    if (listSize === 0){
      speakOutput = "You are not tracking any deals at the moment. Please tell me which items you are interested in.";
    }
    else {
      if (listSize === 1) {
        speakOutput = "There is " + listSize + " product that I'm following: " + subscribedItems[0].productName + ".";
      }
      else{
        speakOutput = "There are " + subscribedItems.length + " products that I'm following: ";
        for (var index = 0; index < listSize; index++){
          var item = subscribedItems[index];
          speakOutput += item.productName;
          speakOutput += (index == (subscribedItems.length - 2)) ? " and " : (index == (subscribedItems.length - 1)) ? "." : ", ";
        }
      }
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt()
      .getResponse();
  },
};

const BuyOnThresholdIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'BuyOnThresholdIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const request = handlerInput.requestEnvelope.request;
    const price = request.intent.slots.price.value;
    const session = handlerInput.attributesManager.getSessionAttributes();
    session.price = price;
    handlerInput.attributesManager.setSessionAttributes(session);

    var speakOutput = "";

    const item = subscribedItems.find(obj => {return (obj.productName).toLowerCase() === (session.productDescription).toLowerCase()});
    if (item === undefined) {
      speakOutput = session.productDescription + " could not be found in your list.";
    }
    else {
      subscribedItems.find(obj => {return (obj.productName).toLowerCase() === (session.productDescription).toLowerCase()}).price = price;
      speakOutput = "Thanks. I'll let you know when the price for " + session.productDescription + " drops below "
        + price + " dollars.";
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt()
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
  //              This handler will not be triggered except in those locales, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    // Gets the locale from the request and initializes
    // i18next.
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
    });
    // Creates a localize function to support arguments.
    localizationClient.localize = function localize() {
      // gets arguments through and passes them to
      // i18next using sprintf to replace string placeholders
      // with arguments.
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values,
      });

      // If an array is used then a random value is selected
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    // this gets the request attributes and save the localize function inside
    // it to be used in a handler by calling requestAttributes.t(STRING_ID, [args...])
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchIntent,
    NameIntent,
    NotificationIntent,
    SubscribeIntent,
    ListItemIntent,
    BuyOnThresholdIntent,
    UnsubscribeIntent,
    ModifyThresholdIntent,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

const itemData = [
  {
    "productName": "iPhone X",
    "price": 999
  },
  {
    "productName": "Echo Dot",
    "price": 30
  },
  {
    "productName": "Tumi Backpack",
    "price": 400
  },
  {
    "productName": "Bose Quite Comfort 35 Noise Cancelling Headphone",
    "price": 350
  },
  {
    "productName": "Samsung 60 Inch TV",
    "price": 600
  }
]

const subscribedItems = [];

// translations
const deData = {
  translation: {
    SKILL_NAME: 'Weltraumwissen',
    GET_FACT_MESSAGE: 'Hier sind deine Fakten: ',
    HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
    HELP_REPROMPT: 'Wie kann ich dir helfen?',
    FALLBACK_MESSAGE: 'Die Weltraumfakten Skill kann dir dabei nicht helfen. Sie kann dir Fakten über den Raum erzählen, wenn du dannach fragst.',
    FALLBACK_REPROMPT: 'Wie kann ich dir helfen?',
    ERROR_MESSAGE: 'Es ist ein Fehler aufgetreten.',
    STOP_MESSAGE: 'Auf Wiedersehen!',
    FACTS:
      [
        'Ein Jahr dauert auf dem Merkur nur 88 Tage.',
        'Die Venus ist zwar weiter von der Sonne entfernt, hat aber höhere Temperaturen als Merkur.',
        'Venus dreht sich entgegen dem Uhrzeigersinn, möglicherweise aufgrund eines früheren Zusammenstoßes mit einem Asteroiden.',
        'Auf dem Mars erscheint die Sonne nur halb so groß wie auf der Erde.',
        'Jupiter hat den kürzesten Tag aller Planeten.',
      ],
  },
};

const dedeData = {
  translation: {
    SKILL_NAME: 'Weltraumwissen auf Deutsch',
  },
};

// TODO: Replace this data with your own."**  This is the data for our skill.  You can see that it is a simple list of facts.

// TODO: The items below this comment need your attention."** This is the beginning of the section where you need to customize several text strings for your skill.
const enData = {
  translation: {
    SKILL_NAME: 'Deal Assistant',
    GET_FACT_MESSAGE: 'Here\'s your fact: ',
    HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
    HELP_REPROMPT: 'What can I help you with?',
    FALLBACK_MESSAGE: 'The Deal Assistant skill can\'t help you with that.  It can help you to find deals on Amazon.com.',
    FALLBACK_REPROMPT: 'What can I help you with?',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    STOP_MESSAGE: 'Goodbye!',
    FACTS:
      [
        'A year on Mercury is just 88 days long.',
        'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
        'On Mars, the Sun appears about half the size as it does on Earth.',
        'Jupiter has the shortest day of all the planets.',
        'The Sun is an almost perfect sphere.',
      ],
  },
};

const enauData = {
  translation: {
    SKILL_NAME: 'Austrailian Space Facts',
  },
};

const encaData = {
  translation: {
    SKILL_NAME: 'Canadian Space Facts',
  },
};

const engbData = {
  translation: {
    SKILL_NAME: 'British Space Facts',
  },
};

const eninData = {
  translation: {
    SKILL_NAME: 'Indian Space Facts',
  },
};

const enusData = {
  translation: {
    SKILL_NAME: 'American Space Facts',
  },
};

const esData = {
  translation: {
    SKILL_NAME: 'Curiosidades del Espacio',
    GET_FACT_MESSAGE: 'Aquí está tu curiosidad: ',
    HELP_MESSAGE: 'Puedes decir dime una curiosidad del espacio o puedes decir salir... Cómo te puedo ayudar?',
    HELP_REPROMPT: 'Como te puedo ayudar?',
    FALLBACK_MESSAGE: 'La skill Curiosidades del Espacio no te puede ayudar con eso.  Te puede ayudar a descubrir curiosidades sobre el espacio si dices dime una curiosidad del espacio. Como te puedo ayudar?',
    FALLBACK_REPROMPT: 'Como te puedo ayudar?',
    ERROR_MESSAGE: 'Lo sentimos, se ha producido un error.',
    STOP_MESSAGE: 'Adiós!',
    FACTS:
        [
          'Un año en Mercurio es de solo 88 días',
          'A pesar de estar más lejos del Sol, Venus tiene temperaturas más altas que Mercurio',
          'En Marte el sol se ve la mitad de grande que en la Tierra',
          'Jupiter tiene el día más corto de todos los planetas',
          'El sol es una esféra casi perfecta',
        ],
  },
};

const esesData = {
  translation: {
    SKILL_NAME: 'Curiosidades del Espacio para España',
  },
};

const esmxData = {
  translation: {
    SKILL_NAME: 'Curiosidades del Espacio para México',
  },
};

const frData = {
  translation: {
    SKILL_NAME: 'Anecdotes de l\'Espace',
    GET_FACT_MESSAGE: 'Voici votre anecdote : ',
    HELP_MESSAGE: 'Vous pouvez dire donne-moi une anecdote, ou, vous pouvez dire stop... Comment puis-je vous aider?',
    HELP_REPROMPT: 'Comment puis-je vous aider?',
    FALLBACK_MESSAGE: 'La skill des anecdotes de l\'espace ne peux vous aider avec cela. Je peux vous aider à découvrir des anecdotes sur l\'espace si vous dites par exemple, donne-moi une anecdote. Comment puis-je vous aider?',
    FALLBACK_REPROMPT: 'Comment puis-je vous aider?',
    ERROR_MESSAGE: 'Désolé, une erreur est survenue.',
    STOP_MESSAGE: 'Au revoir!',
    FACTS:
        [
          'Une année sur Mercure ne dure que 88 jours.',
          'En dépit de son éloignement du Soleil, Vénus connaît des températures plus élevées que sur Mercure.',
          'Sur Mars, le Soleil apparaît environ deux fois plus petit que sur Terre.',
          'De toutes les planètes, Jupiter a le jour le plus court.',
          'Le Soleil est une sphère presque parfaite.',
        ],
  },
};

const frfrData = {
  translation: {
    SKILL_NAME: 'Anecdotes françaises de l\'espace',
  },
};

const itData = {
  translation: {
    SKILL_NAME: 'Aneddoti dallo spazio',
    GET_FACT_MESSAGE: 'Ecco il tuo aneddoto: ',
    HELP_MESSAGE: 'Puoi chiedermi un aneddoto dallo spazio o puoi chiudermi dicendo "esci"... Come posso aiutarti?',
    HELP_REPROMPT: 'Come posso aiutarti?',
    FALLBACK_MESSAGE: 'Non posso aiutarti con questo. Posso aiutarti a scoprire fatti e aneddoti sullo spazio, basta che mi chiedi di dirti un aneddoto. Come posso aiutarti?',
    FALLBACK_REPROMPT: 'Come posso aiutarti?',
    ERROR_MESSAGE: 'Spiacenti, si è verificato un errore.',
    STOP_MESSAGE: 'A presto!',
    FACTS:
      [
        'Sul pianeta Mercurio, un anno dura solamente 88 giorni.',
        'Pur essendo più lontana dal Sole, Venere ha temperature più alte di Mercurio.',
        'Su Marte il sole appare grande la metà che su la terra. ',
        'Tra tutti i pianeti del sistema solare, la giornata più corta è su Giove.',
        'Il Sole è quasi una sfera perfetta.',
      ],
  },
};

const ititData = {
  translation: {
    SKILL_NAME: 'Aneddoti dallo spazio',
  },
};

const jpData = {
  translation: {
    SKILL_NAME: '日本語版豆知識',
    GET_FACT_MESSAGE: '知ってましたか？',
    HELP_MESSAGE: '豆知識を聞きたい時は「豆知識」と、終わりたい時は「おしまい」と言ってください。どうしますか？',
    HELP_REPROMPT: 'どうしますか？',
    ERROR_MESSAGE: '申し訳ありませんが、エラーが発生しました',
    STOP_MESSAGE: 'さようなら',
    FACTS:
      [
        '水星の一年はたった88日です。',
        '金星は水星と比べて太陽より遠くにありますが、気温は水星よりも高いです。',
        '金星は反時計回りに自転しています。過去に起こった隕石の衝突が原因と言われています。',
        '火星上から見ると、太陽の大きさは地球から見た場合の約半分に見えます。',
        '木星の<sub alias="いちにち">1日</sub>は全惑星の中で一番短いです。',
        '天の川銀河は約50億年後にアンドロメダ星雲と衝突します。',
      ],
  },
};

const jpjpData = {
  translation: {
    SKILL_NAME: '日本語版豆知識',
  },
};

const ptData = {
  translation: {
    SKILL_NAME: 'Fatos Espaciais',
    GET_FACT_MESSAGE: 'Aqui vai: ',
    HELP_MESSAGE: 'Você pode me perguntar por um fato interessante sobre o espaço, ou, fexar a skill. Como posso ajudar?',
    HELP_REPROMPT: 'O que vai ser?',
    FALLBACK_MESSAGE: 'A skill fatos espaciais não tem uma resposta para isso. Ela pode contar informações interessantes sobre o espaço, é só perguntar. Como posso ajudar?',
    FALLBACK_REPROMPT: 'Eu posso contar fatos sobre o espaço. Como posso ajudar?',
    ERROR_MESSAGE: 'Desculpa, algo deu errado.',
    STOP_MESSAGE: 'Tchau!',
    FACTS:
      [
        'Um ano em Mercúrio só dura 88 dias.',
        'Apesar de ser mais distante do sol, Venus é mais quente que Mercúrio.',
        'Visto de marte, o sol parece ser metade to tamanho que nós vemos da terra.',
        'Júpiter tem os dias mais curtos entre os planetas no nosso sistema solar.',
        'O sol é quase uma esfera perfeita.',
      ],
  },
};

// constructs i18n and l10n data structure
// translations for this sample can be found at the end of this file
const languageStrings = {
  'de': deData,
  'de-DE': dedeData,
  'en': enData,
  'en-AU': enauData,
  'en-CA': encaData,
  'en-GB': engbData,
  'en-IN': eninData,
  'en-US': enusData,
  'es': esData,
  'es-ES': esesData,
  'es-MX': esmxData,
  'fr': frData,
  'fr-FR': frfrData,
  'it': itData,
  'it-IT': ititData,
  'ja': jpData,
  'ja-JP': jpjpData,
  'pt': ptData,
  'pt-BR': ptData
};
