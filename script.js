function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(c.substring(nameEQ.length, c.length));
            }
            catch (e) {
                return [];
            }
        }
    }
    return null;
}

const osrsBosses = [
    'Abyssal Sire',
    'Alchemical Hydra',
    'Amoxliatl',
    'Araxxor',
    'Artio',
    'Barrows Chests',
    'Brutus',
    'Bryophyta',
    'Callisto',
    "Calvar'ion",
    'Cerberus',
    'Chambers of Xeric',
    'Chambers of Xeric: Challenge Mode',
    'Chaos Elemental',
    'Chaos Fanatic',
    'Commander Zilyana',
    'Corporeal Beast',
    'Crazy Archaeologist',
    'Dagannoth Prime',
    'Dagannoth Rex',
    'Dagannoth Supreme',
    'Deranged Archaeologist',
    'Doom of Mokhaiotl',
    'Duke Sucellus',
    'General Graardor',
    'Giant Mole',
    'Grotesque Guardians',
    'Hespori',
    'Kalphite Queen',
    'King Black Dragon',
    'Kraken',
    "Kree'Arra",
    "K'ril Tsutsaroth",
    'Lunar Chests',
    'Mad Angel',
    'Maggot King',
    'Mimic',
    'Nex',
    'Nightmare',
    "Phosani's Nightmare",
    'Obor',
    'Phantom Muspah',
    'Sarachnis',
    'Scorpia',
    'Scurrius',
    'Shellbane Gryphon',
    'Skotizo',
    'Sol Heredit',
    'Spindel',
    'Tempoross',
    'The Gauntlet',
    'The Corrupted Gauntlet',
    'The Hueycoatl',
    'The Leviathan',
    'The Royal Titans',
    'The Whisperer',
    'Theatre of Blood',
    'Theatre of Blood: Hard Mode',
    'Thermonuclear Smoke Devil',
    'Tombs of Amascut',
    'Tombs of Amascut: Expert Mode',
    'TzKal-Zuk',
    'TzTok-Jad',
    'Vardorvis',
    'Venenatis',
    "Vet'ion",
    'Vorkath',
    'Wintertodt',
    'Yama',
    'Zalcano',
    'Zulrah',
];

document.addEventListener('DOMContentLoaded', () => {
    const osrsLookupForm = document.getElementById('osrsLookupForm');
    const osrsPlayerName = document.getElementById('osrsPlayerName');
    const osrsLookupStatus = document.getElementById('osrsLookupStatus');
    const osrsLookupResults = document.getElementById('osrsLookupResults');

    osrsLookupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const playerName = osrsPlayerName.value.trim();
        if (!playerName) {
            return;
        }

        osrsLookupStatus.textContent = 'Loading player stats...';
        osrsLookupResults.hidden = true;

        try {
            const url = new URL('https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws');
            url.searchParams.set('player', playerName);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Hiscores request failed (${response.status}).`);
            }

            const rows = (await response.text()).trim().split(/\r?\n/).map((line) =>
                line.split(',').map(Number)
            );
            if (rows.length < 25 || !Number.isFinite(rows[0][1]) || rows[0][1] < 0) {
                throw new Error('No hiscores data was returned for that player.');
            }

            const bossStartIndex = rows.length - osrsBosses.length;
            if (bossStartIndex < 25) {
                throw new Error('Hiscores response did not include the expected boss data.');
            }
            const bossKcs = rows
                .slice(bossStartIndex)
                .map((row, index) => ({
                    name: osrsBosses[index],
                    kc: row[1],
                }))
                .filter(({ kc }) => Number.isInteger(kc) && kc > 0);
            const raidNames = new Set([
                'Chambers of Xeric',
                'Chambers of Xeric: Challenge Mode',
                'Theatre of Blood',
                'Theatre of Blood: Hard Mode',
                'Tombs of Amascut',
                'Tombs of Amascut: Expert Mode',
            ]);
            const raidKcs = bossKcs.filter(({ name }) => raidNames.has(name));
            const otherBossKcs = bossKcs.filter(({ name }) => !raidNames.has(name));
            const highestBoss = otherBossKcs.reduce((highest, current) =>
                current.kc > (highest?.kc ?? 0) ? current : highest, null
            );
            const highestRaid = raidKcs.reduce((highest, current) =>
                current.kc > (highest?.kc ?? 0) ? current : highest, null
            );

            document.getElementById('osrsResultName').textContent = playerName;
            document.getElementById('osrsResultTotalLevel').textContent = rows[0][1].toLocaleString();
            document.getElementById('osrsResultBoss').textContent = highestBoss
                ? `${highestBoss.name}: ${highestBoss.kc.toLocaleString()}`
                : 'No ranked boss kills';
            document.getElementById('osrsResultRaid').textContent = highestRaid
                ? `${highestRaid.name}: ${highestRaid.kc.toLocaleString()}`
                : 'No ranked raid completions';
            osrsLookupResults.hidden = false;
            osrsLookupStatus.textContent = '';
        } catch (error) {
            osrsLookupStatus.textContent = error instanceof Error
                ? error.message
                : 'Unable to load hiscores data.';
        }
    });

    const dramaInput = document.getElementById('dramaInput');
    const dramaRatingInput = document.getElementById('dramaRatingInput');
    const addDramaButton = document.getElementById('addDramaButton');
    const dramaList = document.getElementById('dramaList');

    let dramas = getCookie('dramas') || [];
    if (!dramas || dramas.length === 0) {
        dramas = [
            { name: 'Love Between Fairy and Devil', rating: 7 },
            { name: 'Love Between Lines', rating: 10 },
            { name: 'Overdo', rating: 5 },
        ];
        setCookie('dramas', JSON.stringify(dramas), 30);
    }

    function saveAndRenderDramas() {
        setCookie('dramas', JSON.stringify(dramas), 30);
        render();
    }

    function render() {
        dramas.sort((a, b) => b.rating - a.rating);
        dramaList.innerHTML = '';

        dramas.forEach((drama, index) => {
            const li = document.createElement('li');
            li.innerHTML = 
            `${drama.name} - Rating: <input type="number" class="rating-input" data-index="${index}" value="${drama.rating}" min="1" max="10"> <button class="delete-button" data-index="${index}">Delete</button>`;
            dramaList.appendChild(li);
        });
    }
    

    addDramaButton.addEventListener('click', () => {
        const name = dramaInput.value.trim();
        const rating = parseInt(dramaRatingInput.value);

        if (name && !isNaN(rating) && rating >= 1 && rating <= 10) {
            if (dramas.some(drama => drama.name.toLowerCase() === name.toLowerCase())) {
                alert('This drama is already in the list.');
                return;
            }
            else {
                dramas.push({ name, rating });
            }
            saveAndRenderDramas();
            dramaInput.value = '';
            dramaRatingInput.value = '5';
        }
        else {
            alert('Please enter a valid drama name and a rating between 1 and 10.');
        }  
    });

    dramaList.addEventListener('change', (event) => {
        if (event.target.classList.contains('rating-input')) {
            const index = Number(event.target.getAttribute('data-index'));
            const newRating = parseInt(event.target.value);
            if (Number.isInteger(index) && dramas[index] && !isNaN(newRating) && newRating >= 1 && newRating <= 10) {
                dramas[index].rating = newRating;
                saveAndRenderDramas();
            }
            else {
                alert('Please enter a valid rating between 1 and 10.');
                render();
            }
        }
    });

    dramaList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const index = Number(event.target.getAttribute('data-index'));
            if (!Number.isInteger(index) || !dramas[index]) {
                return;
            }
            dramas.splice(index, 1);
            saveAndRenderDramas();
        }
    });

    render();
}); 