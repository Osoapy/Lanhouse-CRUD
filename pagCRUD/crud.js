document.addEventListener('DOMContentLoaded', () => {
    const deviceForm = document.getElementById('deviceForm');
    const deviceTableBody = document.getElementById('deviceTableBody');
    const endTimeInput = document.getElementById('endTime');
    let devices = JSON.parse(localStorage.getItem('devices')) || [];
    const accessPopup = document.getElementById('accessPopup');
    const accessKeyInput = document.getElementById('accessKey');
    const correctAccessKey = 'lanhouse123'; // Senha correta

    // função pra senha
    window.checkAccessKey = function() {
        const enteredKey = accessKeyInput.value;
        if (enteredKey === correctAccessKey) {
            accessPopup.style.display = 'none'; // Esconde o pop-up
            document.body.style.display = 'block'; // Mostra o conteúdo da página
        } else {
            alert('Senha incorreta! Tente novamente.');
            accessKeyInput.value = ''; // Limpa o campo de senha
        }
    }

    // Função para definir o valor do campo de data e hora para a data e hora atuais
    function setCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        endTimeInput.value = currentDateTime;
    }

    deviceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const deviceType = document.getElementById('deviceType').value;
        const userName = document.getElementById('userName').value;
        const endTime = document.getElementById('endTime').value;

        const newDevice = {
            id: Date.now(),
            deviceType,
            userName,
            endTime
        };

        devices.push(newDevice);
        localStorage.setItem('devices', JSON.stringify(devices));
        renderDevices();
        deviceForm.reset();
        setCurrentDateTime();
    });

    function renderDevices() {
        deviceTableBody.innerHTML = '';

        // Ordenar dispositivos pelo horário de término
        devices.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));

        devices.forEach(device => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${device.deviceType}</td>
                <td>${device.userName}</td>
                <td>${new Date(device.endTime).toLocaleString()}</td>
                <td class="actions">
                    <button class="remover" onclick="removeDevice(${device.id})">Remover</button>
                    <button onclick="editDevice(${device.id})">Editar</button>
                </td>
            `;

            deviceTableBody.appendChild(row);
        });

        checkTimes();
    }

    window.removeDevice = function(id) {
        devices = devices.filter(device => device.id !== id);
        localStorage.setItem('devices', JSON.stringify(devices));
        renderDevices();
    }

    window.editDevice = function(id) {
        const device = devices.find(device => device.id === id);
        if (device) {
            document.getElementById('deviceType').value = device.deviceType;
            document.getElementById('userName').value = device.userName;
            document.getElementById('endTime').value = device.endTime;

            removeDevice(id);
        }
    }

    function checkTimes() {
        const now = new Date();
        devices.forEach(device => {
            const endTime = new Date(device.endTime);
            if (endTime <= now) {
                alert(`O tempo de ${device.userName} no ${device.deviceType} acabou!`);
            }
        });
    }

    setCurrentDateTime();
    renderDevices();
    setInterval(checkTimes, 60000); // Verifica a cada minuto
});
