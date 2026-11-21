const heatmap = document.getElementById('heatmap');
const TOTAL_DAYS = 52 * 7;

for (let i = 0; i < TOTAL_DAYS; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const level = Math.floor(Math.random() * 5);
    if (level > 0) {
        cell.classList.add('l' + level);
    }

    heatmap.appendChild(cell);
}