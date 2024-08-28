document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const mensagemConfirmacao = document.getElementById('mensagemConfirmacao');
    const titulo = document.querySelector('.feedback-container h1');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Verifica se o feedback deve ser enviado de forma anônima
        if (document.getElementById('anonimo').checked) {
            // Substitui os valores dos campos de nome e e-mail por "anônimo"
            document.getElementById('nome').value = 'anônimo';
            document.getElementById('email').value = '';
        }

        // Envia o formulário usando fetch
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Limpa o formulário
                form.reset();

                // Atualiza o título
                titulo.textContent = 'Feedback Recebido';

                // Esconde o formulário e mostra a mensagem de confirmação
                form.style.display = 'none'; // Esconde o formulário
                mensagemConfirmacao.style.display = 'block'; // Mostra a mensagem de confirmação
            } else {
                alert('Houve um erro ao enviar seu feedback. Por favor, tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Houve um erro ao enviar seu feedback. Por favor, tente novamente.');
        });
    });
});
