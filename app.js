let voices = []; // To store the available voices

// Function to initialize voices
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    console.log(voices); // To see the list of available voices in the console
}

// Load voices when they become available
window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
    console.log("Voices loaded successfully.");
};


const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    // Select Microsoft Zira voice
    const femaleVoice = voices.find(voice => voice.name === 'Microsoft Zira - English (United States)');
    if (femaleVoice) {
        text_speak.voice = femaleVoice;
        console.log("Using voice:", femaleVoice.name); // Debug to confirm selection
    } else {
        console.warn("Microsoft Zira voice not found. Using default voice.");
    }

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Sir...")
    }

    else if (hour > 12 && hour < 17) {
        speak("Good Afternoon Boss...")
    }

    else {
        speak("Good Evening Sir...")
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS....");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommmand(transcript.toLowerCase());


}

btn.addEventListener('click', () => {
    content.textContent = "Listening.....";
    recognition.start();
})

// Intents with flexible phrasing
const intents = [
    {
        keywords: ['hey', 'hello', 'hi', 'good morning', 'good afternoon', 'good evening'],
        action: () => speak("Hello boss, How may I assist you today?"),
    },
    {
        keywords: ['how are you', 'how do you do', 'how is it going'],
        action: () => speak("I'm just a program, but I'm here and ready to help you! How can I assist you?"),
    },
    {
        keywords: ['what is your name', 'who are you'],
        action: () => speak("I am JARVIS, your personal assistant. How can I make your day better?"),
    },
    {
        keywords: ['thank you', 'thanks', 'thanks a lot'],
        action: () => speak("You're welcome! Always here to help."),
    },
    {
        keywords: ['what can you do', 'what are your capabilities', 'help me'],
        action: () => speak("I can open websites, tell you the time and date, perform basic calculations, and have a conversation. Just tell me what you need."),
    },
    {
        keywords: ['bye', 'goodbye', 'see you later'],
        action: () => speak("Goodbye! Have a great day ahead."),
    },
    {
        keywords: ['joke', 'make me laugh', 'tell me a joke'],
        action: () => speak("Why don't skeletons fight each other? Because they don't have the guts!"),
    },
    {
        keywords: ['google', 'search', 'open google'],
        action: (message) => {
            if (message.includes('search')) {
                const query = message.replace('search', '').replace('on google', '').trim();
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
                speak(`Searching Google for ${query}`);
            } else {
                window.open("https://google.com", "_blank");
                speak("Opening Google...");
            }
        },
    },
    {
        keywords: ['facebook'],
        action: () => {
            window.open("https://facebook.com", "_blank");
            speak("Opening Facebook...");
        },
    },
    {
        keywords: ['play', 'song', 'music'],
        action: (message) => {
            const searchTerm = message.replace('play', '').replace('song', '').replace('music', '').trim();
            if (searchTerm) {
                const query = encodeURIComponent(searchTerm);
                window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
                speak(`Playing ${searchTerm} on YouTube.`);
            } else {
                speak("Please tell me the name of the song or music you want me to play.");
            }
        },
        // keywords: ['youtube', 'video', 'play music', 'song','some songs', 'some music', 'some videos'],
        // action: () => {
        //     window.open("https://youtube.com", "_blank");
        //     speak("Opening YouTube...");
        // },
    },
    {
        keywords: ['time', 'current time'],
        action: () => {
            const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric", second: "numeric" });
            speak(`The current time is ${time}`);
        },
    },
    {
        keywords: ['date', 'today'],
        action: () => {
            const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
            speak(`Today's date is ${date}`);
        },
    },
    {
        keywords: ['calculate', '+', '-', '*', '/'],
        action: (message) => {
            try {
                const sanitizedMessage = message.replace(/[^-()\d/*+.]/g, '');
                const result = eval(sanitizedMessage);
                speak(`The result is ${result}`);
            } catch {
                speak("I couldn't calculate that. Please try again.");
            }
        },
    },
];

// Intent processing with NLP
function takeCommmand(message) {
    for (let intent of intents) {
        for (let keyword of intent.keywords) {
            if (message.includes(keyword)) {
                intent.action(message);
                return;
            }
        }
    }
    speak("I didn't understand that. Can you please repeat?");
}
