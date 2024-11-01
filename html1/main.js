async function buscarEventos() {
    try {
        const resposta = await fetch('http://localhost:3031/mostrarEvent');
        
        if (!resposta.ok) {
            throw new Error('Erro na rede');
        }

        const eventos = await resposta.json();
        return eventos;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}


function atualizarTabela(eventos) {
    const output = document.getElementById('tabela');
    output.innerHTML = '';

    eventos.forEach(evento => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evento.id}</td>
            <td>${evento.nome}</td>
            <td>${new Date(evento.data).toLocaleDateString()}</td>
            <td>${evento.descricao}</td>
            <td>${evento.local}</td>
            <td>${evento.horario}</td>
        `;
        output.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const eventos = await buscarEventos();
    atualizarTabela(eventos);
});
