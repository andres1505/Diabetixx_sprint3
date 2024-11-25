// Función de búsqueda de contenido
function searchContent() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const contentItems = document.querySelectorAll('.content-item');

    contentItems.forEach(item => {
        const title = item.getAttribute('data-title').toLowerCase();
        if (title.includes(input)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
