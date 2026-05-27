const BASE_URL = 'http://localhost:3000/api';

const mockParticipant = {
    name: "João da Silva Teste",
    school: "Escola Estadual de Testes",
    grade: "2º Ano",
    age: 16,
    email: "joao.teste@escola.com.br",
    nick: "JotinhaQA",
    game: "Free Fire",
    type: "Competidor",
    team_name: "QA Free Fire",
    members: "João",
    guardian: "Maria da Silva",
    guardian_phone: "11988887777"
};

async function runIntegrationTests() {
    console.log("Iniciando testes...");
    let participantId;

    try {
        console.log("Criando participante...");
        const postRes = await fetch(`${BASE_URL}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockParticipant)
        });
        const postData = await postRes.json();
        console.log(` -> Status HTTP: ${postRes.status}`);
        console.log(` -> Resposta:`, postData);

        participantId = postData.id;
        if (!participantId) {
            throw new Error("Sem ID retornado");
        }

        console.log("Buscando lista...");
        const getListRes = await fetch(`${BASE_URL}/participants`);
        const getListData = await getListRes.json();
        console.log(` -> Status HTTP: ${getListRes.status}`);
        console.log('Resposta:');
        console.log(getListData);

        const isPublicDataSafe = getListData.some(p => p.id === participantId && p.nick === mockParticipant.nick && !p.email && !p.guardian_phone);
        console.log('Dados publicos seguros?', isPublicDataSafe);

        console.log('Atualizando fluxo...');
        const putFlowRes = await fetch(`${BASE_URL}/flow/${participantId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: "check-in_concluido",
                location: "Recepção Principal"
            })
        });
        const putFlowData = await putFlowRes.json();
        console.log(` -> Status HTTP: ${putFlowRes.status}`);
        console.log(` -> Resposta:`, putFlowData);

        console.log("Buscando fluxo geral...");
        const getFlowRes = await fetch(`${BASE_URL}/flow`);
        const getFlowData = await getFlowRes.json();
        console.log(` -> Status HTTP: ${getFlowRes.status}`);
        console.log(` -> Resposta:`);
        console.log(getFlowData);

        const flowUpdated = getFlowData.some(f => f.id === participantId && f.status === "check-in_concluido" && f.location === "Recepção Principal");
        console.log('Fluxo atualizado?', flowUpdated);

        console.log("Removendo participante...");
        const deleteRes = await fetch(`${BASE_URL}/participants/${participantId}`, {
            method: 'DELETE'
        });
        const deleteData = await deleteRes.json();
        console.log(` -> Status HTTP: ${deleteRes.status}`);
        console.log(` -> Resposta:`, deleteData);

        console.log("Concluido!");

    } catch (error) {
        console.error("Erro:", error.message);
    }
}

runIntegrationTests();
