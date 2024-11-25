function previewProfilePhoto(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const profileImage = document.getElementById('profile-image');
        profileImage.src = reader.result; // Previsualizar imagen
    };
    if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

function saveProfile() {
    const profileData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        weight: document.getElementById('weight').value,
        activityLevel: document.getElementById('activity-level').value,
        diabetesCondition: document.getElementById('diabetes-condition').value,
    };

    const profilePhoto = document.getElementById('profile-image').src;

    // Guardar datos en localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('profilePhoto', profilePhoto);

    alert('Perfil guardado con éxito.');

    disableEditMode(); // Deshabilitar edición tras guardar
    loadProfile(); // Actualizar la vista
}

function loadProfile() {
    const profilePhoto = localStorage.getItem('profilePhoto');
    if (profilePhoto) {
        document.getElementById('profile-image').src = profilePhoto;
    }

    const profileData = JSON.parse(localStorage.getItem('profileData'));
    if (profileData) {
        document.getElementById('name').value = profileData.name || '';
        document.getElementById('age').value = profileData.age || '';
        document.getElementById('gender').value = profileData.gender || '';
        document.getElementById('weight').value = profileData.weight || '';
        document.getElementById('activity-level').value = profileData.activityLevel || '';
        document.getElementById('diabetes-condition').value = profileData.diabetesCondition || '';
    }
}

function enableEditMode() {
    // Habilitar edición
    document.querySelectorAll('#profile-form input, #profile-form select').forEach((field) => {
        field.disabled = false;
    });
    document.getElementById('save-button').style.display = 'block';
    document.getElementById('edit-button').style.display = 'none';
    document.querySelector('.upload-button').style.display = 'block';
    document.getElementById('upload-photo').style.display = 'block';
}

function disableEditMode() {
    // Deshabilitar edición
    document.querySelectorAll('#profile-form input, #profile-form select').forEach((field) => {
        field.disabled = true;
    });
    document.getElementById('save-button').style.display = 'none';
    document.getElementById('edit-button').style.display = 'block';
    document.querySelector('.upload-button').style.display = 'none';
    document.getElementById('upload-photo').style.display = 'none';
}

// Cargar perfil al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});


