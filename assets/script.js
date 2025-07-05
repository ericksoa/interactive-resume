async function loadEvents() {
    const response = await fetch('data/career.json');
    const events = await response.json();

    const categories = new Set(events.map(e => e.category));
    const filtersContainer = document.getElementById('filters');
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }

    categories.forEach(cat => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.dataset.category = cat;
        checkbox.addEventListener('change', filterEvents);
        label.appendChild(checkbox);
        label.append(' ' + cat);
        filtersContainer.appendChild(label);
    });

    const timeline = document.getElementById('timeline');
    const template = document.getElementById('event-template');

    events.forEach(ev => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.title').textContent = ev.title;
        clone.querySelector('.date').textContent = ev.date;
        clone.querySelector('.summary').textContent = ev.summary;
        const details = clone.querySelector('.details');
        details.innerHTML = ev.details;

        const section = clone.querySelector('section');
        section.dataset.category = ev.category;
        section.dataset.search = `${ev.title} ${ev.summary} ${ev.details}`.toLowerCase();
        section.addEventListener('click', () => {
            details.hidden = !details.hidden;
        });

        timeline.appendChild(clone);
    });

    filterEvents();
}

function filterEvents() {
    const checkboxes = document.querySelectorAll('#filters input[type=checkbox]');
    const query = document.getElementById('search')?.value.toLowerCase() || '';
    const activeCategories = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.dataset.category);

    document.querySelectorAll('#timeline .event').forEach(ev => {
        const matchesCategory = activeCategories.includes(ev.dataset.category);
        const matchesQuery = ev.dataset.search.includes(query);
        ev.style.display = matchesCategory && matchesQuery ? '' : 'none';
    });
}

loadEvents();
