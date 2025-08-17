// Helper: date & time formatting
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}
function formatTime(timeStr) {
    // Converts 24hr "18:00" to "6:00 PM"
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = ((hour + 11) % 12 + 1);
    return `${hour12}:${m} ${ampm}`;
}

// Main dynamic rendering
fetch('upcomingBhajans.json')
    .then(res => res.json())
    .then(events => {
        // Highlighted Bhajan
        const highlightBhajan = events.find(ev => ev.highlight);
        if (highlightBhajan) {
            document.getElementById('highlighted-bhajan').innerHTML = `
                <div class="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                    <div>
                        <span class="inline-block text-sm font-semibold text-blue-600 dark:text-blue-200 mb-2">
                            ${formatDate(highlightBhajan.date)}, ${formatTime(highlightBhajan.time)}
                        </span>
                        <h2 class="text-2xl font-bold mb-1">${highlightBhajan.title}</h2>
                        <div class="text-gray-700 dark:text-gray-200 mb-2">
                            <span class="font-semibold">Venue:</span> ${highlightBhajan.venue}
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 mb-2">${highlightBhajan.description}</p>
                    </div>
                    <div class="flex-shrink-0 w-full md:w-64 h-48 overflow-hidden rounded-xl shadow">
                        <iframe
                            src="${highlightBhajan.mapLink}"
                            width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen=""
                            aria-hidden="false" tabindex="0"></iframe>
                    </div>
                </div>
            `;

        }

        // Upcoming Bhajan List (exclude highlighted one)
        const listContainer = document.getElementById('upcoming-list');
        const otherBhajans = events.filter(ev => !ev.highlight);
        if (otherBhajans.length === 0) {
            listContainer.innerHTML = '<li class="text-center py-2 text-gray-500">No upcoming bhajans found.</li>';
        } else {
            listContainer.innerHTML = '';
            otherBhajans.forEach(ev => {
                listContainer.innerHTML += `
                    <li class="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                            <span class="inline-block font-semibold text-blue-700 dark:text-blue-200 mb-1">
                                ${formatDate(ev.date)}
                            </span>
                            <span class="block text-lg font-bold">${ev.title}</span>
                            <span class="block text-sm text-gray-700 dark:text-gray-400">Venue: ${ev.venue}</span>
                        </div>
                        <span class="mt-2 sm:mt-0 text-xs px-3 py-1 bg-blue-100 dark:bg-gray-700 rounded-full text-blue-700 dark:text-blue-300">
                            ${formatTime(ev.time)}
                        </span>
                    </li>
                `;
            });
        }
    });
