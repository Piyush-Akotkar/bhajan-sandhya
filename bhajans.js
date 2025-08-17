let allBhajans = [];

function renderBhajans(bhajans) {
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
}

// Fetch and setup search
fetch('bhajans.json')
    .then(res => res.json())
    .then(bhajans => {
        allBhajans = bhajans;
        renderBhajans(allBhajans);

        const searchInput = document.querySelector("input[type='text'][placeholder='Search bhajans...']");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.trim().toLowerCase();
                const filtered = allBhajans.filter(bhajan =>
                    bhajan.searchKey && bhajan.searchKey.toLowerCase().includes(query)
                );
                renderBhajans(filtered);
            });
        }
    });
