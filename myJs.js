const URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";


// Function for getting the definitons of given word by accesing the data obtained from API call through out index positions and then filtering it with it the key  
// "partOfSpeech"  (since the data obtained from API call is in form of an array in array..)
function getDefinitionsByPartOfSpeech(data, partOfSpeech) {
    const meanings = data[0].meanings.filter(meaning => meaning.partOfSpeech === partOfSpeech);
    return meanings.flatMap(meaning => meaning.definitions.map(def => def.definition));
}


//Function to take definitions and then display them in order starting with and index number beggining from number 1.
function formatDefinitions(definitions) {
    return definitions.map((definition, index) => `${index + 1}. ${definition}`).join('<br>');
}


// Function to display searched word into a heading in output section
function displayWord(word) {
    const wordHeading = document.getElementById("word");
    wordHeading.textContent = word;

    const wordN = document.getElementById("word_n");
    wordN.textContent = word;

    const wordV = document.getElementById("word_v");
    wordV.textContent = word;

    const wordA = document.getElementById("word_a");
    wordA.textContent = word;

}


//Function do display given word from user to different location 
function displayHeadings() {
    //const heading_meaning = document.getElementById("meaning_heading");
    //heading_meaning.textContent = "Meanings: "

    const wordHeading_N = document.getElementById("noun");
    wordHeading_N.textContent = "[Noun]";

    const wordHeading_V = document.getElementById("verb");
    wordHeading_V.textContent = "[Verb]";

    const wordHeading_A = document.getElementById("adjective");
    wordHeading_A.textContent = "[Adjective]";
}

//Quick function to scroll to obtained results when button is pressed 
function scrollToResults() {
    const resultsSection = document.getElementById("api_text");
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

//Function to check if given word has audio and making sure that audio is in uk or us version of English
function checkAudio(data) {
    audio = data[0].phonetics[0].audio;

    if (audio.slice(-7) !== '-us.mp3' || audio.slice(-7) !== '-uk.mp3') {
        audio = data[0].phonetics[1].audio;
    }
    else if (audio.slice(-7) !== '-us.mp3' || audio.slice(-7) !== '-uk.mp3') {
        audio = data[0].phonetics[2].audio;
    }
    else if (audio.slice(-7) !== '-us.mp3' || audio.slice(-7) !== '-uk.mp3') {
        audio = data[0].phonetics[3].audio;
    }

}


//Function to set Audio 
function setAudio() {
    document.getElementById('soundtrack').innerHTML = `
      <audio controls
        id='background_audio1'>
          <source src='${audio}' />
          Your browser does not support the audio element.
      </audio>
    `;
}

function displayHr(){
    document.getElementById("hr_1").style.display = "";
    document.getElementById("hr_2").style.display = "";
    document.getElementById("hr_3").style.display = "";
    document.getElementById("hr_4").style.display = "";
    document.getElementById("hr_5").style.display = "";
    document.getElementById("hr_6").style.display = "";
}

// Function to fetch API data and display definition and everything around it
async function fetchDataAndDisplayDefinitions() {
    const givenWord = document.getElementById("word_given").value;
    const mainURL = URL + givenWord;

    try {
        const response = await fetch(mainURL);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(data);
        displayWord(givenWord);
        displayHeadings();
        checkAudio(data);
        setAudio();

        displayHr();
        const noun_meaning = getDefinitionsByPartOfSpeech(data, 'noun');
        const verb_meaning = getDefinitionsByPartOfSpeech(data, 'verb');
        const adjective_meaning = getDefinitionsByPartOfSpeech(data, 'adjective');

        const noun_Paragraph = document.getElementById('noun_meaning');
        const verb_Paragraph = document.getElementById('verb_meaning');
        const adjective_Paragraph = document.getElementById('adjective_meaning');

        noun_Paragraph.innerHTML = formatDefinitions(noun_meaning);
        verb_Paragraph.innerHTML = formatDefinitions(verb_meaning);
        adjective_Paragraph.innerHTML = formatDefinitions(adjective_meaning);

        

    } catch (error) {
        console.error('Error fetching data:', error);
        alert("The word you entered is not valid.");
    }
    scrollToResults();
}


document.getElementById('fetchButton').addEventListener('click', fetchDataAndDisplayDefinitions);


