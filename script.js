const input = document.querySelector('input')
const btn = document.querySelector('button')
const dictionaryArea = document.querySelector('.dictionary-app')

async function dictionaryFn(word){
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        const data = await res.json()
        return data[0]
    } catch (error) {
        console.error(`Error fetching data for word "${word}":`, error)
        throw error
    }
}

btn.addEventListener('click', fetchandCreateCard)

async function fetchandCreateCard(){
    try {
        const word = input.value.trim()
        if (!word) {
            alert("Please enter a word")
            return
        }
        const data = await dictionaryFn(word)

        console.log(data)

        let partOfSpeechArray = []

        for(let i=0 ; i<data.meanings.length ; i++){
            partOfSpeechArray.push(data.meanings[i].partOfSpeech)
        }

        dictionaryArea.innerHTML = `
        <div class="card">
                   <div class="property">
                    <span style="color: #FF00FF;">Word:</span>
                    <span>${data.word}</span>
                   </div>

                   <div class="property">
                    <span style="color: #FF00FF;">phonetics:</span>
                    <span>${data.phonetic}</span>
                   </div>

                   <div class="property">
                    <span>
                    <audio controls src="${data.phonetics[0].audio}"></audio>
                    </span>
                   </div>

                   <div class="property">
                    <span style="color: #FF00FF;">Definition:</span>
                    <span>${data.meanings[0].definitions[0].definition}</span>
                   </div>

                   <div class="property">
                    <span style="color: #FF00FF;">Example</span>
                    <span>${data.meanings[0].definitions[0].example}</span>
                   </div>

                   <div class="property">
                   <span style="color: #FF00FF;">Part of Speech:</span>
                    <span>${partOfSpeechArray.map(e => e).join(', ')}</span>
                   </div>
              </div>
        `
    } catch (error) {
        if (error.status === 404) {
            alert(`Word not found: ${input.value}`)
        } else {
            console.error("Error:", error)
            alert("An error occurred. Please try again.")
        }
    }
}