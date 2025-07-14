// Modelo de datos
let volunteers = []; // Lista maestra de voluntarios
let volunteersInPlace = []; // Voluntarios en el lugar
let volunteersInside = []; // Voluntarios en el interior
let timers = {}; // Cronómetros para voluntarios en el interior
let currentLlamadoId = null; // ID del llamado actual

// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la fecha y hora actual en el campo de hora de llamada
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16);
    document.getElementById('hora-llamada').value = formattedDateTime;
    
    // Cargar voluntarios desde la API
    loadVolunteers();
    
    // Configurar eventos para el modal de voluntarios
    setupVolunteerModal();
    
    // Configurar eventos para el modal de confirmación
    setupConfirmModal();
    
    // Configurar eventos de drag and drop
    setupDragAndDrop();
    
    // Configurar evento para el botón de cerrar llamado
    document.getElementById('close-call-btn').addEventListener('click', function() {
        document.getElementById('confirm-modal').style.display = 'block';
    });
    
    // Crear un nuevo llamado al cargar la página
    createNewLlamado();
});

// Funciones para gestionar voluntarios
async function loadVolunteers() {
    try {
        // Cargar voluntarios desde la API
        volunteers = await ApiService.getVoluntarios();
        
        if (volunteers.length === 0) {
            // Si no hay voluntarios, crear algunos de ejemplo
            const ejemplos = [
                { registro: 45, cargo: 'Capitán', nombre: 'Juan Pérez' },
                { registro: 67, cargo: 'Teniente 1ero', nombre: 'María Rodríguez' },
                { registro: 89, cargo: 'Bombero', nombre: 'Carlos González' },
                { registro: 112, cargo: 'Bombero', nombre: 'Ana Silva' },
                { registro: 23, cargo: 'Maquinista', nombre: 'Pedro Sánchez' }
            ];
            
            for (const voluntario of ejemplos) {
                await ApiService.createVoluntario(voluntario);
            }
            
            // Volver a cargar los voluntarios
            volunteers = await ApiService.getVoluntarios();
        }
        
        // Ordenar y mostrar voluntarios
        sortVolunteers();
        renderVolunteersList();
    } catch (error) {
        console.error('Error al cargar voluntarios:', error);
        alert('Error al cargar voluntarios. Usando datos locales temporalmente.');
        
        // Usar datos de ejemplo si falla la API
        volunteers = [
            { _id: '1', registro: 45, cargo: 'Capitán', nombre: 'Juan Pérez' },
            { _id: '2', registro: 67, cargo: 'Teniente 1ero', nombre: 'María Rodríguez' },
            { _id: '3', registro: 89, cargo: 'Bombero', nombre: 'Carlos González' },
            { _id: '4', registro: 112, cargo: 'Bombero', nombre: 'Ana Silva' },
            { _id: '5', registro: 23, cargo: 'Maquinista', nombre: 'Pedro Sánchez' }
        ];
        
        sortVolunteers();
        renderVolunteersList();
    }
}

function sortVolunteers() {
    // Orden de cargos según especificación
    const cargoOrder = {
        'Director': 1,
        'Capitán': 2,
        'Secretario': 3,
        'Teniente 1ero': 4,
        'Teniente 2do': 5,
        'Teniente 3ero': 6,
        'Maquinista': 7,
        'Ayudante': 8,
        'Bombero': 9,
        '': 10 // Sin cargo
    };
    
    // Ordenar por cargo y luego alfabéticamente por nombre
    volunteers.sort((a, b) => {
        // Primero por cargo
        const cargoComparison = (cargoOrder[a.cargo] || 10) - (cargoOrder[b.cargo] || 10);
        if (cargoComparison !== 0) return cargoComparison;
        
        // Luego por nombre
        return a.nombre.localeCompare(b.nombre);
    });
}

function renderVolunteersList() {
    const volunteersList = document.getElementById('volunteers-list');
    volunteersList.innerHTML = '';
    
    volunteers.forEach((volunteer, index) => {
        const volunteerElement = document.createElement('div');
        volunteerElement.className = 'volunteer-item';
        volunteerElement.setAttribute('draggable', 'true');
        volunteerElement.setAttribute('data-id', volunteer._id);
        
        // Mostrar número de índice, registro, cargo y nombre
        volunteerElement.innerHTML = `
            <span class="volunteer-index">${index + 1}.</span>
            <span class="volunteer-registro">${volunteer.registro}</span>
            ${volunteer.cargo ? `<span class="volunteer-cargo">${volunteer.cargo}</span>` : ''}
            <span class="volunteer-nombre">${volunteer.nombre}</span>
            <div class="volunteer-actions">
                <button class="volunteer-action-btn edit-btn" title="Editar">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="volunteer-action-btn delete-btn" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Configurar eventos para los botones de editar y eliminar
        const editBtn = volunteerElement.querySelector('.edit-btn');
        const deleteBtn = volunteerElement.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditVolunteerModal(volunteer);
        });
        
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm(`¿Está seguro que desea eliminar a ${volunteer.nombre}?`)) {
                deleteVolunteer(volunteer._id);
            }
        });
        
        // Configurar eventos de arrastre
        volunteerElement.addEventListener('dragstart', handleDragStart);
        
        volunteersList.appendChild(volunteerElement);
    });
    
    // Actualizar contador de voluntarios
    updateCounters();
}

async function addVolunteer(volunteer) {
    try {
        const savedVolunteer = await ApiService.createVoluntario(volunteer);
        volunteers.push(savedVolunteer);
        sortVolunteers();
        renderVolunteersList();
    } catch (error) {
        console.error('Error al añadir voluntario:', error);
        alert('Error al añadir voluntario. Por favor, inténtelo de nuevo.');
    }
}

async function updateVolunteer(updatedVolunteer) {
    try {
        const savedVolunteer = await ApiService.updateVoluntario(updatedVolunteer._id, updatedVolunteer);
        const index = volunteers.findIndex(v => v._id === updatedVolunteer._id);
        if (index !== -1) {
            volunteers[index] = savedVolunteer;
            sortVolunteers();
            renderVolunteersList();
        }
    } catch (error) {
        console.error('Error al actualizar voluntario:', error);
        alert('Error al actualizar voluntario. Por favor, inténtelo de nuevo.');
    }
}

async function deleteVolunteer(id) {
    try {
        await ApiService.deleteVoluntario(id);
        volunteers = volunteers.filter(v => v._id !== id);
        renderVolunteersList();
    } catch (error) {
        console.error('Error al eliminar voluntario:', error);
        alert('Error al eliminar voluntario. Por favor, inténtelo de nuevo.');
    }
}

// Funciones para el modal de voluntarios
function setupVolunteerModal() {
    const modal = document.getElementById('volunteer-modal');
    const addBtn = document.getElementById('add-volunteer-btn');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('volunteer-form');
    
    // Abrir modal al hacer clic en "Añadir Voluntario"
    addBtn.addEventListener('click', function() {
        openAddVolunteerModal();
    });
    
    // Cerrar modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const volunteerId = document.getElementById('volunteer-id').value;
        const registro = parseInt(document.getElementById('registro').value);
        const cargo = document.getElementById('cargo').value;
        const nombre = document.getElementById('nombre').value;
        
        const volunteer = {
            registro,
            cargo,
            nombre
        };
        
        if (volunteerId) {
            volunteer._id = volunteerId;
            updateVolunteer(volunteer);
        } else {
            addVolunteer(volunteer);
        }
        
        modal.style.display = 'none';
    });
}

function openAddVolunteerModal() {
    const modal = document.getElementById('volunteer-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('volunteer-form');
    
    modalTitle.textContent = 'Añadir Voluntario';
    form.reset();
    document.getElementById('volunteer-id').value = '';
    
    modal.style.display = 'block';
}

function openEditVolunteerModal(volunteer) {
    const modal = document.getElementById('volunteer-modal');
    const modalTitle = document.getElementById('modal-title');
    
    modalTitle.textContent = 'Editar Voluntario';
    
    document.getElementById('volunteer-id').value = volunteer._id;
    document.getElementById('registro').value = volunteer.registro;
    document.getElementById('cargo').value = volunteer.cargo || '';
    document.getElementById('nombre').value = volunteer.nombre;
    
    modal.style.display = 'block';
}

// Funciones para el modal de confirmación
function setupConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    const confirmBtn = document.getElementById('confirm-close-btn');
    const cancelBtn = document.getElementById('cancel-close-btn');
    
    confirmBtn.addEventListener('click', function() {
        closeCall();
        modal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Funciones para drag and drop
function setupDragAndDrop() {
    // Configurar zonas de destino
    const column2 = document.getElementById('volunteers-in-place');
    const column3 = document.getElementById('volunteers-inside');
    
    column2.addEventListener('dragover', handleDragOver);
    column2.addEventListener('drop', function(e) {
        handleDrop(e, 'place');
    });
    
    column3.addEventListener('dragover', handleDragOver);
    column3.addEventListener('drop', function(e) {
        handleDrop(e, 'inside');
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
    e.target.classList.add('dragging');
    
    // Determinar origen del arrastre (columna 1, 2 o 3)
    if (e.target.closest('#volunteers-list')) {
        e.dataTransfer.setData('source', 'list');
    } else if (e.target.closest('#volunteers-in-place')) {
        e.dataTransfer.setData('source', 'place');
    } else if (e.target.closest('#volunteers-inside')) {
        e.dataTransfer.setData('source', 'inside');
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e, targetZone) {
    e.preventDefault();
    
    const volunteerId = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');
    
    // Eliminar clase de arrastre de todos los elementos
    document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
    });
    
    // Manejar diferentes casos de arrastre según origen y destino
    if (targetZone === 'place') {
        if (source === 'list') {
            // De lista maestra a "en el lugar"
            moveVolunteerToPlace(volunteerId);
        } else if (source === 'inside') {
            // De "en el interior" a "en el lugar"
            moveVolunteerFromInsideToPlace(volunteerId);
        }
    } else if (targetZone === 'inside') {
        if (source === 'place') {
            // De "en el lugar" a "en el interior"
            moveVolunteerToInside(volunteerId);
        }
    }
}

async function moveVolunteerToPlace(volunteerId) {
    // Verificar si el voluntario ya está en el lugar
    if (volunteersInPlace.some(v => v._id === volunteerId)) {
        return;
    }
    
    const volunteer = volunteers.find(v => v._id === volunteerId);
    if (volunteer && currentLlamadoId) {
        const now = new Date();
        
        try {
            // Registrar asistencia en la API
            await ApiService.registrarAsistencia(currentLlamadoId, {
                voluntarioId: volunteerId,
                horaLlegada: now
            });
            
            // Añadir a la lista local
            const volunteerInPlace = {
                ...volunteer,
                arrivalTime: now,
                insideHistory: [] // Historial de entradas/salidas del interior
            };
            
            volunteersInPlace.push(volunteerInPlace);
            renderVolunteersInPlace();
        } catch (error) {
            console.error('Error al registrar asistencia:', error);
            alert('Error al registrar asistencia. Por favor, inténtelo de nuevo.');
        }
    }
}

async function moveVolunteerToInside(volunteerId) {
    // Buscar el voluntario en la lista de "en el lugar"
    const volunteerIndex = volunteersInPlace.findIndex(v => v._id === volunteerId);
    if (volunteerIndex === -1) return;
    
    const volunteer = volunteersInPlace[volunteerIndex];
    
    // Verificar si el voluntario ya está en el interior
    if (volunteersInside.some(v => v._id === volunteerId)) {
        return;
    }
    
    const now = new Date();
    
    try {
        // Registrar ingreso en la API
        if (currentLlamadoId) {
            await ApiService.registrarIngreso(currentLlamadoId, {
                voluntarioId: volunteerId,
                horaIngreso: now
            });
        }
        
        // Añadir a la lista local
        const volunteerInside = {
            ...volunteer,
            entryTime: now,
            insideRecord: {
                entryTime: now,
                exitTime: null,
                duration: 0
            }
        };
        
        // Añadir a la lista de "en el interior"
        volunteersInside.push(volunteerInside);
        
        // Iniciar cronómetro
        startTimer(volunteerId);
        
        // Actualizar listas
        renderVolunteersInside();
    } catch (error) {
        console.error('Error al registrar ingreso:', error);
        alert('Error al registrar ingreso. Por favor, inténtelo de nuevo.');
    }
}

async function moveVolunteerFromInsideToPlace(volunteerId) {
    // Buscar el voluntario en la lista de "en el interior"
    const volunteerIndex = volunteersInside.findIndex(v => v._id === volunteerId);
    if (volunteerIndex === -1) return;
    
    const volunteer = volunteersInside[volunteerIndex];
    const now = new Date();
    
    // Calcular duración en el interior
    const entryTime = volunteer.entryTime;
    const durationMs = now - entryTime;
    const durationSec = Math.floor(durationMs / 1000);
    
    try {
        // Registrar salida en la API
        if (currentLlamadoId) {
            await ApiService.registrarSalida(currentLlamadoId, {
                voluntarioId: volunteerId,
                horaSalida: now
            });
        }
        
        // Actualizar registro de tiempo en el interior
        const insideRecord = {
            entryTime: entryTime,
            exitTime: now,
            duration: durationSec
        };
        
        // Buscar el voluntario en la lista de "en el lugar" y actualizar su historial
        const placeIndex = volunteersInPlace.findIndex(v => v._id === volunteerId);
        if (placeIndex !== -1) {
            volunteersInPlace[placeIndex].insideHistory = 
                volunteersInPlace[placeIndex].insideHistory || [];
            volunteersInPlace[placeIndex].insideHistory.push(insideRecord);
        }
        
        // Detener cronómetro
        stopTimer(volunteerId);
        
        // Eliminar de la lista de "en el interior"
        volunteersInside.splice(volunteerIndex, 1);
        
        // Actualizar listas
        renderVolunteersInPlace();
        renderVolunteersInside();
    } catch (error) {
        console.error('Error al registrar salida:', error);
        alert('Error al registrar salida. Por favor, inténtelo de nuevo.');
    }
}

// Funciones para renderizar listas
function renderVolunteersInPlace() {
    const container = document.getElementById('volunteers-in-place');
    container.innerHTML = '';
    
    volunteersInPlace.forEach((volunteer, index) => {
        const element = document.createElement('div');
        element.className = 'volunteer-item';
        element.setAttribute('draggable', 'true');
        element.setAttribute('data-id', volunteer._id);
        
        // Formatear hora de llegada
        const arrivalTime = formatTime(volunteer.arrivalTime);
        
        // Crear contenido HTML
        let html = `
            <span class="volunteer-index">${index + 1}.</span>
            ${volunteer.cargo ? `<span class="volunteer-cargo">${volunteer.cargo}</span>` : ''}
            <span class="volunteer-nombre">${volunteer.nombre}</span>
            <span class="volunteer-arrival">- Llegada: ${arrivalTime}</span>
        `;
        
        // Añadir historial de interior si existe
        if (volunteer.insideHistory && volunteer.insideHistory.length > 0) {
            // Calcular tiempo total en interior
            let totalDuration = 0;
            volunteer.insideHistory.forEach(record => {
                totalDuration += record.duration;
            });
            
            // Obtener último registro
            const lastRecord = volunteer.insideHistory[volunteer.insideHistory.length - 1];
            const lastEntryTime = formatTime(new Date(lastRecord.entryTime));
            const lastExitTime = formatTime(new Date(lastRecord.exitTime));
            const lastDuration = formatDuration(lastRecord.duration);
            const totalDurationFormatted = formatDuration(totalDuration);
            
            html += `
                <div class="inside-history">
                    <span>(Interior: Total ${totalDurationFormatted}, Última ${lastDuration})</span>
                </div>
            `;
        }
        
        element.innerHTML = html;
        
        // Configurar eventos de arrastre
        element.addEventListener('dragstart', handleDragStart);
        
        container.appendChild(element);
    });
    
    // Actualizar contador
    updateCounters();
}

function renderVolunteersInside() {
    const container = document.getElementById('volunteers-inside');
    container.innerHTML = '';
    
    // Ordenar por tiempo en interior (más tiempo primero)
    const sortedVolunteers = [...volunteersInside].sort((a, b) => {
        return new Date(a.entryTime) - new Date(b.entryTime);
    });
    
    sortedVolunteers.forEach((volunteer, index) => {
        const element = document.createElement('div');
        element.className = 'volunteer-item volunteer-inside';
        element.setAttribute('draggable', 'true');
        element.setAttribute('data-id', volunteer._id);
        
        // Formatear hora de ingreso
        const entryTime = formatTime(volunteer.entryTime);
        
        // Crear contenido HTML
        element.innerHTML = `
            <span class="volunteer-index">${index + 1}.</span>
            ${volunteer.cargo ? `<span class="volunteer-cargo">${volunteer.cargo}</span>` : ''}
            <span class="volunteer-nombre">${volunteer.nombre}</span>
            <span class="volunteer-entry">- Ingreso: ${entryTime}</span>
            <span class="timer" id="timer-${volunteer._id}">| Tiempo: 00:00</span>
        `;
        
        // Configurar eventos de arrastre
        element.addEventListener('dragstart', handleDragStart);
        
        container.appendChild(element);
    });
    
    // Actualizar contador
    updateCounters();
}

// Funciones para cronómetros
function startTimer(volunteerId) {
    const volunteer = volunteersInside.find(v => v._id === volunteerId);
    if (!volunteer) return;
    
    const startTime = volunteer.entryTime;
    
    // Detener cronómetro existente si hay
    if (timers[volunteerId]) {
        clearInterval(timers[volunteerId]);
    }
    
    // Iniciar nuevo cronómetro
    timers[volunteerId] = setInterval(() => {
        const now = new Date();
        const elapsedMs = now - startTime;
        const elapsedSec = Math.floor(elapsedMs / 1000);
        
        // Formatear tiempo
        const minutes = Math.floor(elapsedSec / 60);
        const seconds = elapsedSec % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Actualizar elemento del cronómetro
        const timerElement = document.getElementById(`timer-${volunteerId}`);
        if (timerElement) {
            timerElement.textContent = `| Tiempo: ${timeString}`;
            
            // Aplicar alertas visuales
            const volunteerElement = timerElement.closest('.volunteer-inside');
            
            if (elapsedSec >= 1200) { // 20 minutos (1200 segundos)
                volunteerElement.classList.add('danger');
                volunteerElement.classList.remove('warning');
            } else if (elapsedSec >= 900) { // 15 minutos (900 segundos)
                volunteerElement.classList.add('warning');
                volunteerElement.classList.remove('danger');
            } else {
                volunteerElement.classList.remove('warning', 'danger');
            }
        }
    }, 1000);
}

function stopTimer(volunteerId) {
    if (timers[volunteerId]) {
        clearInterval(timers[volunteerId]);
        delete timers[volunteerId];
    }
}

// Función para crear un nuevo llamado
async function createNewLlamado() {
    try {
        // Crear un nuevo llamado con datos mínimos
        const now = new Date();
        const llamado = {
            codigo: '',
            tipo: '',
            direccion: '',
            horaLlamada: now,
            oficialACargo: ''
        };
        
        const response = await ApiService.createLlamado(llamado);
        currentLlamadoId = response._id;
        
        console.log('Nuevo llamado creado con ID:', currentLlamadoId);
    } catch (error) {
        console.error('Error al crear nuevo llamado:', error);
        alert('Error al crear nuevo llamado. Algunas funcionalidades pueden no estar disponibles.');
    }
}

// Función para cerrar llamado
async function closeCall() {
    // Validar datos del encabezado
    const codigo = document.getElementById('codigo').value;
    if (!codigo) {
        alert('Debe ingresar al menos el código del llamado antes de cerrarlo.');
        return;
    }
    
    // Recopilar datos del llamado
    const callData = {
        codigo: codigo,
        tipo: document.getElementById('tipo').value,
        direccion: document.getElementById('direccion').value,
        horaLlamada: document.getElementById('hora-llamada').value,
        oficialACargo: document.getElementById('oficial-cargo').value
    };
    
    try {
        // Actualizar datos del llamado
        if (currentLlamadoId) {
            await ApiService.updateLlamado(currentLlamadoId, callData);
            
            // Cerrar el llamado
            await ApiService.cerrarLlamado(currentLlamadoId);
        }
        
        // Limpiar datos del llamado actual
        volunteersInPlace = [];
        volunteersInside = [];
        
        // Detener todos los cronómetros
        Object.keys(timers).forEach(id => {
            clearInterval(timers[id]);
        });
        timers = {};
        
        // Limpiar interfaz
        document.getElementById('codigo').value = '';
        document.getElementById('tipo').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('oficial-cargo').value = '';
        
        // Actualizar hora actual
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);
        document.getElementById('hora-llamada').value = formattedDateTime;
        
        // Actualizar listas
        renderVolunteersInPlace();
        renderVolunteersInside();
        
        // Crear un nuevo llamado
        createNewLlamado();
        
        alert('Llamado cerrado correctamente.');
    } catch (error) {
        console.error('Error al cerrar llamado:', error);
        alert('Error al cerrar llamado. Por favor, inténtelo de nuevo.');
    }
}

// Funciones auxiliares
function updateCounters() {
    document.getElementById('place-counter').textContent = `Total en el lugar: ${volunteersInPlace.length}`;
    document.getElementById('interior-counter').textContent = `Total en interior: ${volunteersInside.length}`;
}

function formatTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
