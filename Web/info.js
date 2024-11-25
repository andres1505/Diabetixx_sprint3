let currentReportTarget = {};

// Cargar temas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTopics();
});

// Abrir y cerrar modal para agregar tema
function addTopic() {
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Abrir y cerrar modal para reportar
function openReportModal(targetType, targetIndex) {
    currentReportTarget = { type: targetType, index: targetIndex };
    document.getElementById('reportModal').style.display = 'flex';
}

function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}

// Guardar tema en localStorage
function saveTopic() {
    const newTopic = document.getElementById('newTopic').value;
    if (newTopic) {
        let topics = JSON.parse(localStorage.getItem('topics')) || [];
        topics.push({ title: newTopic, conversations: [] }); // Cada tema tiene su array de conversaciones
        localStorage.setItem('topics', JSON.stringify(topics));
        loadTopics();
        closeModal();
    }
}

// Cargar temas desde localStorage
function loadTopics() {
    const topicsContainer = document.getElementById('topics');
    topicsContainer.innerHTML = ''; // Limpiar contenido actual
    const topics = JSON.parse(localStorage.getItem('topics')) || [];
    topics.forEach((topic, index) => {
        const topicCard = document.createElement('div');
        topicCard.classList.add('topic-card');
        topicCard.innerHTML = `
            <p>${topic.title}</p>
            <button class="report-button" onclick="openReportModal('topic', ${index})">Reportar</button>
        `;
        topicCard.onclick = () => viewConversation(index);
        topicsContainer.appendChild(topicCard);
    });
}

// Ver conversación de un tema
function viewConversation(index) {
    document.getElementById('topics').style.display = 'none';
    document.getElementById('conversation-section').style.display = 'block';

    const topics = JSON.parse(localStorage.getItem('topics'));
    const topic = topics[index];

    document.getElementById('conversation-title').textContent = topic.title;
    document.getElementById('conversation-content').innerHTML = '';

    // Renderizar solo las conversaciones del tema seleccionado
    topic.conversations.forEach((message, messageIndex) => {
        renderMessage(message, messageIndex, document.getElementById('conversation-content'), index);
    });

    localStorage.setItem('currentTopicIndex', index); // Guardar el índice del tema actual
}

function renderMessage(message, messageIndex, container, topicIndex) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = `
        <p id="message-text-${topicIndex}-${messageIndex}">${message.text}</p>
        <button class="report-button" onclick="openReportModal('response', ${messageIndex})">Reportar</button>
        <button class="reply-button" onclick="showReplyInput(${topicIndex}, ${messageIndex})">Responder</button>
        <button class="edit-button" onclick="editMessage(${topicIndex}, ${messageIndex})">Editar</button>
    `;

    const repliesContainer = document.createElement('div');
    repliesContainer.classList.add('replies');
    message.replies.forEach((reply, replyIndex) => {
        renderMessage(reply, replyIndex, repliesContainer, topicIndex);
    });

    messageDiv.appendChild(repliesContainer);
    container.appendChild(messageDiv);
}

function showReplyInput(topicIndex, messageIndex) {
    const inputId = `reply-input-${messageIndex}`;
    if (document.getElementById(inputId)) return;

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('reply-input-container');
    inputDiv.innerHTML = `
        <input type="text" id="${inputId}" placeholder="Escribe tu respuesta...">
        <button onclick="saveReply(${topicIndex}, ${messageIndex})">Enviar</button>
    `;

    const messageElement = document.querySelectorAll('.message')[messageIndex];
    messageElement.appendChild(inputDiv);
}

function saveReply(topicIndex, messageIndex) {
    const inputId = `reply-input-${messageIndex}`;
    const replyText = document.getElementById(inputId).value;

    if (replyText) {
        let topics = JSON.parse(localStorage.getItem('topics'));
        const topic = topics[topicIndex];

        // Buscar el mensaje al que se responde
        const message = topic.conversations[messageIndex];
        message.replies.push({ text: replyText, replies: [] });

        // Guardar de nuevo en localStorage
        localStorage.setItem('topics', JSON.stringify(topics));

        // Recargar la conversación actualizada
        viewConversation(topicIndex);
    }
}

// Guardar respuesta principal
function saveResponse() {
    const newResponse = document.getElementById('newResponse').value;
    const currentIndex = parseInt(localStorage.getItem('currentTopicIndex'), 10); // Convertir a entero

    if (newResponse) {
        let topics = JSON.parse(localStorage.getItem('topics'));
        topics[currentIndex].conversations.push({ text: newResponse, replies: [] });
        localStorage.setItem('topics', JSON.stringify(topics));

        viewConversation(currentIndex);
        document.getElementById('newResponse').value = '';
    }
}

// Editar un comentario
function editMessage(topicIndex, messageIndex) {
    const textElement = document.getElementById(`message-text-${topicIndex}-${messageIndex}`);
    const currentText = textElement.textContent;

    textElement.outerHTML = `
        <div id="edit-container-${topicIndex}-${messageIndex}">
            <input type="text" id="edit-input-${topicIndex}-${messageIndex}" value="${currentText}">
            <button onclick="saveEditedMessage(${topicIndex}, ${messageIndex})">Guardar</button>
            <button onclick="cancelEditMessage(${topicIndex}, ${messageIndex}, '${currentText}')">Cancelar</button>
        </div>
    `;
}

function saveEditedMessage(topicIndex, messageIndex) {
    const inputElement = document.getElementById(`edit-input-${topicIndex}-${messageIndex}`);
    const newText = inputElement.value;

    const topics = JSON.parse(localStorage.getItem('topics'));
    const topic = topics[topicIndex];
    topic.conversations[messageIndex].text = newText;

    localStorage.setItem('topics', JSON.stringify(topics));

    const editContainer = document.getElementById(`edit-container-${topicIndex}-${messageIndex}`);
    editContainer.outerHTML = `<p id="message-text-${topicIndex}-${messageIndex}">${newText}</p>`;
}

function cancelEditMessage(topicIndex, messageIndex, originalText) {
    const editContainer = document.getElementById(`edit-container-${topicIndex}-${messageIndex}`);
    editContainer.outerHTML = `<p id="message-text-${topicIndex}-${messageIndex}">${originalText}</p>`;
}

// Guardar reporte
function submitReport() {
    const reportReason = document.getElementById('reportReason').value;
    const reports = JSON.parse(localStorage.getItem('reports')) || [];

    reports.push({
        type: currentReportTarget.type,
        index: currentReportTarget.index,
        reason: reportReason,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem('reports', JSON.stringify(reports));
    closeReportModal();
    alert('El reporte ha sido enviado.');
}

// Regresar a la lista de temas
function backToTopics() {
    document.getElementById('conversation-section').style.display = 'none';
    document.getElementById('topics').style.display = 'flex';
    loadTopics();
}




