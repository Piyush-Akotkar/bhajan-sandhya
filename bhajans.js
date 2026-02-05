// Cache busting - Force fresh load on normal refresh
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
    });
}

let allBhajans = [];
let db = null;

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('BhajanDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('bhajans')) {
                db.createObjectStore('bhajans', { keyPath: 'id' });
            }
        };
    });
}

// Save bhajans to IndexedDB
async function saveBhajansToDB(bhajans) {
    if (!db) return;
    const tx = db.transaction('bhajans', 'readwrite');
    const store = tx.objectStore('bhajans');
    bhajans.forEach(bhajan => store.put(bhajan));
    return new Promise((resolve) => tx.oncomplete = resolve);
}

// Load bhajans from IndexedDB
async function loadBhajansFromDB() {
    if (!db) return [];
    const tx = db.transaction('bhajans', 'readonly');
    const store = tx.objectStore('bhajans');
    return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
    });
}

// Check if bhajans need update (count comparison)
async function checkBhajansUpdate() {
    const offlineCount = await getOfflineBhajanCount();
    
    // ✅ CACHE-BUSTING: Fresh fetch every time
    const cacheBustUrl = `bhajans.json?v=${Date.now()}`;
    try {
        const response = await fetch(cacheBustUrl);
        if (!response.ok) return false;
        
        const onlineBhajans = await response.json();
        return onlineBhajans.length !== offlineCount;  // Update if count changed
    } catch {
        return false;  // Offline = use cached data
    }
}


// Get offline bhajan count
async function getOfflineBhajanCount() {
    if (!db) return 0;
    const tx = db.transaction('bhajans', 'readonly');
    const store = tx.objectStore('bhajans');
    return new Promise((resolve) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
    });
}

function renderBhajans(bhajans, isSearching) {
    const list = document.querySelector('.featured-bhajans-list');
    if (!list) return;

    list.innerHTML = '';
    if (bhajans.length === 0) {
        list.innerHTML = '<li class="col-span-2 text-center">No bhajans found.</li>';
        return;
    }

    bhajans.forEach(bhajan => {
        const li = document.createElement('li');
        li.className = "group cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition p-4 border border-gray-200 dark:border-gray-800 hover:border-blue-400";
        li.innerHTML = `
            <a href="bhajan.html?id=${bhajan.id}" class="block h-full">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg font-bold text-orange-500 dark:text-orange-300">${bhajan.title}</span>
                    <span class="ml-auto text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300">${bhajan.language}</span>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">${bhajan.artist} &middot; ${bhajan.duration}</div>
                <div class="text-gray-700 dark:text-gray-200 text-sm line-clamp-2">${bhajan.lyrics}</div>
            </a>
        `;
        list.appendChild(li);
    });

    const hero = document.querySelector('.hero-section');
    // if (hero) {
    //     hero.style.display = isSearching ? 'none' : 'block';
    // }
    hero.style.display = isSearching ? 'none' : 'block';
}

// Initialize app
async function initApp() {
    await initDB();
    
    // Check if we need to update bhajans
    const needsUpdate = await checkBhajansUpdate();
    
    if (needsUpdate) {
        console.log('Updating bhajans...');
        try {
            const response = await fetch('bhajans.json');
            const bhajans = await response.json();
            allBhajans = bhajans;
            await saveBhajansToDB(bhajans);
            renderBhajans(allBhajans, false);
        } catch (error) {
            console.log('Network unavailable, using offline data');
            allBhajans = await loadBhajansFromDB();
            renderBhajans(allBhajans, false);
        }
    } else {
        // Use offline data
        allBhajans = await loadBhajansFromDB();
        renderBhajans(allBhajans, false);
    }
    
    // Setup search
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim().toLowerCase();
            const filtered = allBhajans.filter(bhajan =>
                bhajan.searchKey && bhajan.searchKey.toLowerCase().includes(query)
            );
            const isSearching = query.length > 0;
            renderBhajans(filtered, isSearching);
        });
    }
}


// Start the app
initApp().catch(console.error);

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}