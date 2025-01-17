let timer;
let timeLeft = 25 * 60; // Varsayılan olarak 25 dakika (Pomodoro modu genelde 25dk şeklinde uygulandığından)
let activeMode = "Pomodoro"; // Başlangıç modunu pomodoro olarak ayarladım.

// HTML elemanlarını seçme
const timeDisplay = document.getElementById('time');
const modeButtons = document.querySelectorAll('.mode-btn');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundMenu = document.getElementById('sound-menu');
const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsMenu = document.getElementById('settings-menu');
const soundImages = document.querySelectorAll('.sound-image');
const settingsIcon = document.getElementById('settings-icon');

// Ayarları seçme
const pomodoroInput = document.getElementById('pomodoro-length');
const shortBreakInput = document.getElementById('short-break');
const longBreakInput = document.getElementById('long-break');

// Start,stop,reset butonları
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

// Mod süreleri (Bu süreler ayarlardan değiştirilebilir.)
let durations = {
    Pomodoro: 25 * 60,
    "Short Break": 5 * 60,
    "Long Break": 10 * 60,
};

// Sayaç icin zamanı ayarlama
function updateTime() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Sayacı başlatma
function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTime();
        } else {
            clearInterval(timer);
            timer = null;
        }
    }, 1000);
}

// Sayacı durdurma
function stopTimer() {
    clearInterval(timer);
    timer = null;
}

// Sayacı sıfırlama
function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = durations[activeMode];
    updateTime();
}

// Modu değiştirme (pomodoro/short break/long break)
function changeMode(mode) {
    activeMode = mode;
    timeLeft = durations[mode];
    updateTime();

    modeButtons.forEach((btn) => {
        btn.classList.remove('active');
        if (btn.textContent === mode) {
            btn.classList.add('active');
        }
    });

    const status = document.querySelector('.status');
    status.textContent = mode === "Pomodoro" ? "Focus" : "Relax";
}

// Mod butonlarına tıklama
modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        changeMode(button.textContent);
        stopTimer();
    });
});

let stopwatchRunning = false;
let stopwatchTime = 0;
let stopwatchTimer;

// Kronometreyi ayarlama
function updateStopwatch() {
    const minutes = Math.floor(stopwatchTime / 60);
    const seconds = stopwatchTime % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Kronometreyi başlatma
function startStopwatch() {
    if (stopwatchRunning) return;
    stopwatchRunning = true;
    stopwatchTimer = setInterval(() => {
        stopwatchTime++;
        updateStopwatch();
    }, 1000);
}

// Kronometreyi durdurma
function stopStopwatch() {
    clearInterval(stopwatchTimer);
    stopwatchRunning = false;
}

// Kronometreyi sıfırlama
function resetStopwatch() {
    clearInterval(stopwatchTimer);
    stopwatchTime = 0;
    stopwatchRunning = false;
    updateStopwatch();
}

const modeSelect = document.getElementById('mode-select');
modeSelect.addEventListener('change', () => {
    const selectedMode = modeSelect.value;

    if (selectedMode === 'Pomodoro') {
        // Pomodoro modu aktif
        document.querySelector('.timer-modes').style.display = 'flex';
        durations.Pomodoro = parseInt(pomodoroInput.value) * 60 || durations.Pomodoro;
        durations["Short Break"] = parseInt(shortBreakInput.value) * 60 || durations["Short Break"];
        durations["Long Break"] = parseInt(longBreakInput.value) * 60 || durations["Long Break"];
        resetTimer();
        enableInputs();
    } else if (selectedMode === 'Stopwatch') {
        // Kronometre modu aktif
        document.querySelector('.timer-modes').style.display = 'none';
        stopTimer(); // Sayaç çalışıyorsa durdur
        resetStopwatch(); // Kronometreyi sıfırla
        disableInputs();
    }
});

function disableInputs() {
    pomodoroInput.disabled = true;
    shortBreakInput.disabled = true;
    longBreakInput.disabled = true;
}

function enableInputs() {
    pomodoroInput.disabled = false;
    shortBreakInput.disabled = false;
    longBreakInput.disabled = false;
}

// Mola ve pomodoro sürelerinin kronometre modunda değiştirilememesi için kontrol
function updateSettings() {
    if (activeMode === "Stopwatch") {
        alert("You cannot change the settings while in Stopwatch mode.");
        return;
    }

    // Pomodoro ve mola sürelerini değiştir
    durations.Pomodoro = parseInt(pomodoroInput.value) * 60 || durations.Pomodoro;
    durations["Short Break"] = parseInt(shortBreakInput.value) * 60 || durations["Short Break"];
    durations["Long Break"] = parseInt(longBreakInput.value) * 60 || durations["Long Break"];

    if (activeMode === "Pomodoro") {
        timeLeft = durations.Pomodoro;
    } else if (activeMode === "Short Break") {
        timeLeft = durations["Short Break"];
    } else if (activeMode === "Long Break") {
        timeLeft = durations["Long Break"];
    }

    updateTime();
}

pomodoroInput.addEventListener('change', updateSettings);
shortBreakInput.addEventListener('change', updateSettings);
longBreakInput.addEventListener('change', updateSettings);

// Ses dosyaları
const sounds = {
    rain: new Audio('sounds/rain.mp3'),
    ocean: new Audio('sounds/ocean.mp3'),
    cafe: new Audio('sounds/cafe.mp3'),
    airplane: new Audio('sounds/airplane.mp3'),
    fireplace: new Audio('sounds/fireplace.mp3'),
};

let currentSound = null;

// Ses seçeneklerine tıklama
function toggleSound(soundName) {
    const soundElement = sounds[soundName];
    const soundImage = document.querySelector(`img[alt="${soundName}"]`);

    if (currentSound === soundElement) {
        // Sese ikinci kez tıklanırsa durdur (Aynı butonu hem sesi çalmak hem de durdurmak için kullandım. İlk tıklandığında kırmızı olup sesi çalıyor, ikinci seferde de durdurup eski haline dönüyor.)
        soundElement.pause();
        soundElement.currentTime = 0;
        currentSound = null;
        soundImage.src = "img/sound_image.png";
    } else {
        // Başka bir ses oynuyorsa onu durdur
        if (currentSound) {
            currentSound.pause();
            currentSound.currentTime = 0;
            const previousImage = document.querySelector(img[src="img/sound_image_active.png"]);
            if (previousImage) previousImage.src = "img/sound_image.png";
        }

        // Yeni sesi oynat ve görseli değiştir
        soundElement.loop = true;
        soundElement.play();
        currentSound = soundElement;
        soundImage.src = "img/sound_image_active.png";
    }
}

updateTime();

// Ses penceresini açıp kapatma
soundToggleBtn.addEventListener('click', () => {
    soundMenu.style.display = soundMenu.style.display === 'block' ? 'none' : 'block';
    const soundImage = soundToggleBtn.querySelector('img');
    soundImage.src = soundMenu.style.display === 'block' 
        ? 'img/sound_image_active.png' 
        : 'img/sound_image.png';
});

// Ayarlar penceresini açıp kapatma
settingsToggleBtn.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
    const settingsImage = settingsToggleBtn.querySelector('img');
    settingsImage.src = settingsMenu.style.display === 'block' ? 'img/settings_image_active.png' : 'img/settings_image.png';
});

// Başlat, Durdur ve Sıfırla Butonları 
startBtn.addEventListener('click', () => {
    if (modeSelect.value === 'Pomodoro') {
        startTimer();
    } else if (modeSelect.value === 'Stopwatch') {
        startStopwatch();
    }
});

stopBtn.addEventListener('click', () => {
    if (modeSelect.value === 'Pomodoro') {
        stopTimer();
    } else if (modeSelect.value === 'Stopwatch') {
        stopStopwatch();
    }
});

resetBtn.addEventListener('click', () => {
    if (modeSelect.value === 'Pomodoro') {
        resetTimer();
    } else if (modeSelect.value === 'Stopwatch') {
        resetStopwatch();
    }
});

// Ses seçeneklerini seç
const soundOptions = document.querySelectorAll('.sound-option');

// Her bir ses seçeneği için event listener ekle
soundOptions.forEach(option => {
    option.addEventListener('click', () => {
        const soundName = option.querySelector('img').alt; // Resmin alt etiketi ses adını belirler
        toggleSound(soundName); // Fonksiyonu çağır
    });
});

// Ses Seviyesi Kaydırıcıyı Seç
const volumeControl = document.getElementById('volume-control');

// Ses Seviyesi Değiştiğinde Olay
volumeControl.addEventListener('input', (event) => {
    const volume = event.target.value / 100; // 0.0 ile 1.0 arasında bir değer
    Object.values(sounds).forEach(sound => {
        sound.volume = volume; // Tüm seslerin seviyesini ayarla
    });
});

// Info Butonu ve Menü Seçimi
const infoToggleBtn = document.getElementById('info-toggle-btn');
const infoMenu = document.getElementById('info-menu');
const closeInfoBtn = document.getElementById('close-info-btn');

// Info Menüsünü Aç/Kapat
infoToggleBtn.addEventListener('click', () => {
    infoMenu.style.display = infoMenu.style.display === 'block' ? 'none' : 'block';
});

// Info Menüsünü Kapat
closeInfoBtn.addEventListener('click', () => {
    infoMenu.style.display = 'none';
});

// Motive Edici Metinler
const motivationalQuotes = [
    "Stay focused and never give up!",
    "You can do it, one step at a time!",
    "Keep pushing, greatness awaits!",
    "Every second counts, make it worthwhile!",
    "Your hard work will pay off!",
    "Focus on the goal, not the obstacles!"
];

// Motive Edici Metin Alanı
const motivationalQuoteElement = document.getElementById('motivational-quote');

// Motive Edici Metin Gösterme Fonksiyonu
function showMotivationalQuote() {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    motivationalQuoteElement.textContent = `"${randomQuote}"`;
    motivationalQuoteElement.style.display = 'block';

    // Metni birkaç saniye sonra gizle
    setTimeout(() => {
        motivationalQuoteElement.style.display = 'none';
    }, 5000); // 5 saniye gösterilir
}

// Zamanlayıcı Başlarken ve Sona Ererken Çalıştır
startBtn.addEventListener('click', () => {
    if (modeSelect.value === 'Pomodoro') {
        showMotivationalQuote();
    }
});

stopBtn.addEventListener('click', () => {
    if (timeLeft === 0 && modeSelect.value === 'Pomodoro') {
        showMotivationalQuote();
    }
});

let autoSwitchEnabled = false;
const autoSwitchCheckbox = document.getElementById('auto-switch');

// Otomatik geçişi ayarla (yani bir pomodoro süresi bittiğinde modu otomatik olarak değiştirerek kısa molaya geçmek, kısa mod bitince uzun moda ve uzun mod bitince tekrar pomodoroya...)
autoSwitchCheckbox.addEventListener('change', () => {
    autoSwitchEnabled = autoSwitchCheckbox.checked;
});

function handleAutoSwitch() {
    if (!autoSwitchEnabled) return;

    if (activeMode === "Pomodoro") {
        // Pomodoro bittiyse kısa molaya geç
        changeMode("Short Break");
        startTimer();
    } else if (activeMode === "Short Break") {
        // Kısa mola bittiyse uzun molaya geç
        changeMode("Long Break");
        startTimer();
    } else if (activeMode === "Long Break") {
        // Uzun mola bittiyse tekrar Pomodoro'ya dön
        changeMode("Pomodoro");
        startTimer();
    }
}

function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTime();
        } else {
            clearInterval(timer);
            timer = null;
            handleAutoSwitch();
        }
    }, 1000);
}

// To-Do list elemanları
const toDoListBtn = document.getElementById('to-do-list-btn');
const toDoListMenu = document.getElementById('to-do-list-menu');
const toDoList = document.getElementById('to-do-list');
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const closeToDoListBtn = document.getElementById('close-to-do-list-btn');

// To-Do list butonunu açma kapatma
toDoListBtn.addEventListener('click', () => {
    toDoListMenu.style.display = toDoListMenu.style.display === 'block' ? 'none' : 'block';
});

// To-Do list penceresini kapatma
closeToDoListBtn.addEventListener('click', () => {
    toDoListMenu.style.display = 'none';
});

// Yapılacakları ekleme
addTaskBtn.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim();
    if (taskText === '') return;

    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        listItem.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    });

    const taskLabel = document.createElement('span');
    taskLabel.textContent = taskText;

    listItem.appendChild(checkbox);
    listItem.appendChild(taskLabel);

    toDoList.appendChild(listItem);
    newTaskInput.value = '';
});

// Tema seçme butonu
const themeToggleBtn = document.getElementById('theme-toggle-btn');
let currentTheme = 'default';

// Seçilen temayı uygula
function applyTheme(theme) {
    document.body.classList.remove('default-theme', 'light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    currentTheme = theme;
}

// Temalar arası döngü (default dan koyu moda, koyu moddan açık moda, sonra tekrar default moda... geçiş)
function toggleTheme() {
    if (currentTheme === 'default') {
        applyTheme('light');
    } else if (currentTheme === 'light') {
        applyTheme('dark');
    } else {
        applyTheme('default');
    }
}

themeToggleBtn.addEventListener('click', toggleTheme);

applyTheme('default');

document.getElementById("theme-toggle-btn").addEventListener("click", function () {
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");

    // Temayı veritabanına kaydetme işlemi
    fetch("save_theme.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: currentTheme }),
    }).then((response) => {
        if (response.ok) {
            console.log("The theme was successfully recorded.");
        } else {
            console.error("An error occurred while saving the theme.");
        }
    });
});

