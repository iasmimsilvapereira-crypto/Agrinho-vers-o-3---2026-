/**
 * ARQUIVO: script.js
 * DESCRIÇÃO: Controla a interatividade, recursos de acessibilidade,
 *            componentes expansíveis e formulários da página.
 */

// Aguarda o carregamento completo do DOM para iniciar os scripts
document.addEventListener('DOMContentLoaded', () => {
    initAcessibilidade();
    initAccordion();
    initFormulario();
    initComentarios();
});

/* ==========================================================================
   1. ACESSIBILIDADE (Aumentar/Diminuir Fonte, Modo Escuro e Leitura por Voz)
   ========================================================================== */
function initAcessibilidade() {
    // --- Controle de Tamanho da Fonte ---
    let tamanhoAtual = 100; // Porcentagem inicial da fonte
    const limiteMin = 70;
    const limiteMax = 140;
    const passo = 10;

    const btnAumentar = document.getElementById('btn-aumentar');
    const btnDiminuir = document.getElementById('btn-diminuir');

    if (btnAumentar && btnDiminuir) {
        btnAumentar.addEventListener('click', () => {
            if (tamanhoAtual < limiteMax) {
                tamanhoAtual += passo;
                document.documentElement.style.fontSize = `${tamanhoAtual}%`;
            }
        });

        btnDiminuir.addEventListener('click', () => {
            if (tamanhoAtual > limiteMin) {
                tamanhoAtual -= passo;
                document.documentElement.style.fontSize = `${tamanhoAtual}%`;
            }
        });
    }

    // --- Alternador de Modo Escuro / Claro ---
    const btnContraste = document.getElementById('btn-contraste');
    if (btnContraste) {
        btnContraste.addEventListener('click', () => {
            document.body.classList.toggle('modo-escuro');
            
            // Atualiza o texto do botão para melhor contexto visual
            const estaEscuro = document.body.classList.contains('modo-escuro');
            btnContraste.setAttribute('aria-pressed', estaEscuro);
        });
    }

    // --- Leitura de Voz (SpeechSynthesis API) ---
    const btnOuvir = document.getElementById('btn-ouvir');
    const btnParar = document.getElementById('btn-parar');
    let escopoLeitura = null;

    if (btnOuvir && btnParar) {
        btnOuvir.addEventListener('click', () => {
            // Cancela leituras anteriores que estejam presas na fila
            window.speechSynthesis.cancel();

            // Seleciona apenas o conteúdo principal para respeitar as boas práticas
            const conteudoPrincipal = document.getElementById('conteudo-principal');
            if (!conteudoPrincipal) return;

            // Extrai o texto limpo ignorando códigos e tags
            const textoParaLer = conteudoPrincipal.innerText;

            // Configura o motor de voz nativo do navegador
            escopoLeitura = new SpeechSynthesisUtterance(textoParaLer);
            escopoLeitura.lang = 'pt-BR'; // Define o idioma para português brasileiro
            escopoLeitura.rate = 1.1;     // Velocidade levemente otimizada para leitura

            // Efeito visual nos botões enquanto a voz fala
            escopoLeitura.onstart = () => {
                btnOuvir.classList.add('ativo');
            };

            escopoLeitura.onend = () => {
                btnOuvir.classList.remove('ativo');
            };

            escopoLeitura.onerror = () => {
                btnOuvir.classList.remove('ativo');
            };

            // Executa a leitura
            window.speechSynthesis.speak(escopoLeitura);
        });

        btnParar.addEventListener('click', () => {
            // Interrompe imediatamente qualquer som emitido pela API
            window.speechSynthesis.cancel();
            if (btnOuvir) {
                btnOuvir.classList.remove('ativo');
            }
        });
    }
}

/* ==========================================================================
   2. COMPONENTE EXPANSÍVEL (Accordion dos Pilares de Produção)
   ========================================================================== */
function initAccordion() {
    const titulosAccordion = document.querySelectorAll('.accordion-titulo');

    titulosAccordion.forEach(titulo => {
        titulo.addEventListener('click', () => {
            const itemAtual = titulo.parentElement;
            const estaAtivo = itemAtual.classList.contains('ativo');

            // Fecha todos os outros blocos antes de abrir o novo (efeito sanfona exclusivo)
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('ativo');
                const btn = item.querySelector('.accordion-titulo');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // Se o item clicado não estava aberto, ele se abre agora
            if (!estaAtivo) {
                itemAtual.classList.add('ativo');
                titulo.setAttribute('aria-expanded', 'true');
            }
        });

        // Acessibilidade por teclado (Ativar com as teclas Enter ou Espaço)
        titulo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                titulo.click();
            }
        });
    });
}

/* ==========================================================================
   3. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE INSCRIÇÃO
   ========================================================================== */
function initFormulario() {
    const formulario = document.getElementById('form-seminario');
    
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento padrão da página

            // Coleta os dados preenchidos pelo leitor
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const cidade = document.getElementById('cidade').value.trim();
            const estado = document.getElementById('estado').value.trim();
            const pais = document.getElementById('pais').value.trim();

            // Validação simples de preenchimento
            if (!nome || !email || !cidade || !estado || !pais) {
                alert('Por favor, preencha todos os campos do formulário de inscrição.');
                return;
            }

            // Exibe mensagem amigável de sucesso na tela
            alert(`Obrigado pela inscrição, ${nome}!\nEnviamos os detalhes do seminário para o e-mail: ${email}.`);
            
            // Limpa os campos do formulário
            formulario.reset();
        });
    }
}

/* ==========================================================================
   4. SISTEMA INTERATIVO DE COMENTÁRIOS
   ========================================================================== */
function initComentarios() {
    const btnEnviarComentario = document.getElementById('btn-enviar-comentario');
    const caixaTextoComentario = document.getElementById('novo-comentario');
    const muralComentarios = document.getElementById('mural-comentarios');

    if (btnEnviarComentario && caixaTextoComentario && muralComentarios) {
        btnEnviarComentario.addEventListener('click', () => {
            const texto = caixaTextoComentario.value.trim();

            if (texto === "") {
                alert("Por favor, digite um comentário antes de enviar.");
                return;
            }

            // Cria dinamicamente a estrutura visual do novo comentário
            const itemComentario = document.createElement('div');
            itemComentario.classList.add('comentario-item');

            // Cria um cabeçalho fictício e seguro para o comentário
            const topoComentario = document.createElement('div');
            topoComentario.classList.add('comentario-topo');
            
            const autor = document.createElement('strong');
            autor.textContent = "Leitor Interativo";

            const dataComentario = document.createElement('span');
            const hoje = new Date();
            dataComentario.textContent = hoje.toLocaleDateString('pt-BR');

            topoComentario.appendChild(autor);
            topoComentario.appendChild(dataComentario);

            // Cria o corpo com o texto inserido
            const corpoComentario = document.createElement('p');
            corpoComentario.textContent = texto;

            // Une as partes e adiciona o comentário no topo da lista
            itemComentario.appendChild(topoComentario);
            itemComentario.appendChild(corpoComentario);
            
            muralComentarios.insertBefore(itemComentario, muralComentarios.firstChild);

            // Limpa a caixa de texto para novas interações
            caixaTextoComentario.value = "";
        });
    }
}
