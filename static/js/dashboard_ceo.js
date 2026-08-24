document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ELEMENTOS DO MODAL PRINCIPAL
    // ==========================================

    const btnAdicionar = document.getElementById(
        'btnAdicionarCategoria'
    );

    const modal = document.getElementById(
        'modalAdicionarImobiliaria'
    );

    const fecharModal = document.getElementById(
        'fecharModal'
    );

    const listaTipos = document.getElementById(
        'listaTiposImobiliaria'
    );


    // ==========================================
    // ELEMENTOS DO MODAL DE CADASTRO
    // ==========================================

    const btnNovoTipo = document.getElementById(
        'btnNovoTipo'
    );

    const modalCadastrarTipo = document.getElementById(
        'modalCadastrarTipo'
    );

    const fecharModalCadastrar = document.getElementById(
        'fecharModalCadastrar'
    );


    // ==========================================
    // ELEMENTOS DO FORMULÁRIO
    // ==========================================

    const fotoTipo = document.getElementById(
        'fotoTipo'
    );

    const previewFoto = document.getElementById(
        'previewFoto'
    );

    const previewImagem = document.getElementById(
        'previewImagem'
    );

    const formCadastrarTipo = document.getElementById(
        'formCadastrarTipo'
    );


    // ==========================================
    // ELEMENTOS DO CROP
    // ==========================================

    const areaCorte = document.getElementById(
        'areaCorte'
    );

    const imagemCorte = document.getElementById(
        'imagemCorte'
    );

    const confirmarCorte = document.getElementById(
        'confirmarCorte'
    );


    // ==========================================
    // VARIÁVEIS DO CROP
    // ==========================================

    let cropper = null;

    let arquivoCortado = null;


    console.log(
        'Dashboard CEO JS carregado'
    );


    // ==========================================
    // CARREGAR TIPOS DISPONÍVEIS
    // ==========================================

    async function carregarTiposDisponiveis() {

        listaTipos.innerHTML = `
            <p>Carregando...</p>
        `;


        try {

            const resposta = await fetch(
                '/dashboard/ceo/tipos-disponiveis'
            );


            const tipos = await resposta.json();


            listaTipos.innerHTML = '';


            if (tipos.length === 0) {

                listaTipos.innerHTML = `
                    <p>
                        Todas as categorias já foram adicionadas.
                    </p>
                `;

                return;

            }


            tipos.forEach(tipo => {

                const item =
                    document.createElement('div');


                item.classList.add(
                    'tipo-item'
                );


                item.innerHTML = `

                    <div class="tipo-info">

                        ${
                            tipo.foto
                            ? `
                                <img
                                    src="/static/imagens/tipos/${tipo.foto}"
                                    alt="${tipo.nome}"
                                >
                            `
                            : ''
                        }

                        <span>
                            ${tipo.nome}
                        </span>

                    </div>


                    <button
                        type="button"
                        onclick="adicionarTipo(${tipo.id})">

                        Adicionar

                    </button>

                `;


                listaTipos.appendChild(
                    item
                );

            });


        } catch (erro) {

            console.error(
                erro
            );


            listaTipos.innerHTML = `
                <p>
                    Erro ao carregar categorias.
                </p>
            `;

        }

    }


    // ==========================================
    // ABRIR MODAL PRINCIPAL
    // ==========================================

    btnAdicionar.addEventListener(
        'click',
        async () => {

            console.log(
                'Botão + clicado'
            );


            modal.classList.add(
                'ativo'
            );


            await carregarTiposDisponiveis();

        }
    );


    // ==========================================
    // FECHAR MODAL PRINCIPAL
    // ==========================================

    fecharModal.addEventListener(
        'click',
        () => {

            modal.classList.remove(
                'ativo'
            );

        }
    );


    modal.addEventListener(
        'click',
        (event) => {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    'ativo'
                );

            }

        }
    );


    // ==========================================
    // ADICIONAR TIPO AO DASHBOARD
    // ==========================================

    window.adicionarTipo = async function(
        idTipo
    ) {

        console.log(
            'Adicionando tipo:',
            idTipo
        );


        try {

            const resposta = await fetch(
                '/dashboard/ceo/adicionar-tipo',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        id_tipo: idTipo
                    })

                }
            );


            const resultado =
                await resposta.json();


            console.log(
                'Resposta do servidor:',
                resultado
            );


            if (!resposta.ok) {

                alert(
                    resultado.erro ||
                    'Não foi possível adicionar a categoria.'
                );

                return;

            }


            if (
                resultado.sucesso
            ) {

                modal.classList.remove(
                    'ativo'
                );


                location.reload();

            }


        } catch (erro) {

            console.error(
                erro
            );


            alert(
                'Erro ao adicionar a categoria.'
            );

        }

    };


    // ==========================================
    // ABRIR MODAL DE NOVO TIPO
    // ==========================================

    btnNovoTipo.addEventListener(
        'click',
        () => {

            modal.classList.remove(
                'ativo'
            );


            modalCadastrarTipo.classList.add(
                'ativo'
            );

        }
    );


    // ==========================================
    // FECHAR MODAL DE NOVO TIPO
    // ==========================================

    fecharModalCadastrar.addEventListener(
        'click',
        () => {

            modalCadastrarTipo.classList.remove(
                'ativo'
            );

        }
    );


    // ==========================================
    // SELECIONAR FOTO
    // ==========================================

    fotoTipo.addEventListener(
        'change',
        () => {

            const arquivo =
                fotoTipo.files[0];


            if (!arquivo) {

                return;

            }


            // Limpa corte anterior

            arquivoCortado = null;


            // Se já existir um Cropper,
            // destrói antes de criar outro

            if (cropper) {

                cropper.destroy();

                cropper = null;

            }


            // Cria URL temporária

            const url =
                URL.createObjectURL(
                    arquivo
                );


            imagemCorte.src =
                url;


            // Mostra área de corte

            areaCorte.style.display =
                'block';


            // Esconde preview anterior

            previewFoto.style.display =
                'none';


            previewImagem.src =
                '';


            // Aguarda imagem carregar

            imagemCorte.onload = () => {

                cropper =
    new Cropper(
        imagemCorte,
        {
            aspectRatio: NaN,

            // Mantém o crop dentro da imagem
            viewMode: 1,

            // Permite mover a imagem
            dragMode: 'move',

            // Área inicial maior
            autoCropArea: 0.95,

            responsive: true,

            background: false,

            movable: true,

            zoomable: true,

            // Zoom com a rodinha do mouse
            zoomOnWheel: true,

            // Zoom por toque
            zoomOnTouch: true,

            // Intensidade do zoom da rodinha
            wheelZoomRatio: 0.2,

            // Permite mover o quadrado de corte
            cropBoxMovable: true,

            // Permite redimensionar o quadrado
            cropBoxResizable: true,

            rotatable: false,

            scalable: false

        }
    );
            };

        }
    );


    // ==========================================
// CONFIRMAR CORTE
// ==========================================

    confirmarCorte.addEventListener(
        'click',
        () => {

            if (!cropper) {

                console.error(
                    'Cropper não inicializado.'
                );

                return;

            }


            // ==================================
            // GERA IMAGEM CORTADA
            // ==================================

            const canvas =
                cropper.getCroppedCanvas(
                    {
                        maxWidth: 1200,
                        maxHeight: 1200,

                        imageSmoothingEnabled: true,

                        imageSmoothingQuality:
                            'high'
                    }
                );


            // ==================================
            // PREVIEW EM PNG
            // ==================================

            previewImagem.src =
                canvas.toDataURL(
                    'image/png'
                );


            previewFoto.style.display =
                'block';


            // ==================================
            // TRANSFORMA EM PNG
            // ==================================

            canvas.toBlob(
                (blob) => {

                    if (!blob) {

                        console.error(
                            'Não foi possível gerar a imagem.'
                        );

                        return;

                    }


                    arquivoCortado =
                        new File(
                            [blob],
                            'foto-cortada.png',
                            {
                                type: 'image/png'
                            }
                        );


                    console.log(
                        'Imagem PNG criada:',
                        arquivoCortado
                    );


                    console.log(
                        'TIPO:',
                        arquivoCortado.type
                    );


                    console.log(
                        'NOME:',
                        arquivoCortado.name
                    );


                    if (cropper) {

                        cropper.destroy();

                        cropper = null;

                    }


                    areaCorte.style.display =
                        'none';

                },

                'image/png'

            );

        }
    );


    // ==========================================
    // CADASTRAR NOVO TIPO
    // ==========================================

    formCadastrarTipo.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();


            const nome =
                document.getElementById(
                    'nomeTipo'
                ).value.trim();


            const erroFoto =
                document.getElementById(
                    'erroFotoTipo'
                );

            const erroNome =
                document.getElementById(
                    'erroNomeTipo'
                );


            erroFoto.textContent =
                '';

            erroNome.textContent =
                '';


            // ==================================
            // VALIDAÇÃO DO NOME
            // ==================================

            if (!nome) {

                erroNome.textContent =
                    'O nome é obrigatório.';

                return;

            }


            // ==================================
            // FORM DATA
            // ==================================

            const formData =
                new FormData();


            formData.append(
                'nome',
                nome
            );


            // IMPORTANTE:
            // envia a imagem CORTADA

            if (arquivoCortado) {

                formData.append(
                    'foto',
                    arquivoCortado
                );

            }


            console.log(
                'Enviando foto:',
                arquivoCortado
            );


            try {

                const resposta =
                    await fetch(
                        '/dashboard/ceo/cadastrar-tipo',
                        {

                            method: 'POST',

                            body: formData

                        }
                    );


                const resultado =
                    await resposta.json();


                console.log(
                    'Cadastro:',
                    resultado
                );


                // ==================================
                // ERRO
                // ==================================

                if (!resposta.ok) {

                    erroNome.textContent =
                        resultado.erro ||
                        'Erro ao cadastrar tipo.';

                    return;

                }


                // ==================================
                // SUCESSO
                // ==================================

                if (
                    resultado.sucesso
                ) {

                    // Fecha modal

                    modalCadastrarTipo.classList.remove(
                        'ativo'
                    );


                    // Limpa formulário

                    formCadastrarTipo.reset();


                    // Limpa preview

                    previewFoto.style.display =
                        'none';

                    previewImagem.src =
                        '';


                    // Limpa arquivo cortado

                    arquivoCortado =
                        null;


                    // Limpa erros

                    erroNome.textContent =
                        '';

                    erroFoto.textContent =
                        '';


                    // Abre modal principal

                    modal.classList.add(
                        'ativo'
                    );


                    // Atualiza lista

                    await carregarTiposDisponiveis();

                }

            } catch (erro) {

                console.error(
                    erro
                );


                erroNome.textContent =
                    'Erro de comunicação com o servidor.';

            }

        }
    );

});

const btnSuporte =
    document.getElementById('btnSuporte');

const modalSuporte =
    document.getElementById('modalSuporte');

const fecharModalSuporte =
    document.getElementById('fecharModalSuporte');

const enviarSuporte =
    document.getElementById('enviarSuporte');

const descricaoSuporte =
    document.getElementById('descricaoSuporte');

const erroSuporte =
    document.getElementById('erroSuporte');


// ==============================
// ABRIR SUPORTE
// ==============================

btnSuporte.addEventListener('click', (event) => {

    event.preventDefault();

    // Abre o modal
    modalSuporte.classList.add('ativo');

    // Limpa o campo
    descricaoSuporte.value = '';

    // Limpa mensagem de erro
    erroSuporte.textContent = '';

    // Foco no campo
    descricaoSuporte.focus();

    // Cursor no início
    descricaoSuporte.setSelectionRange(0, 0);

});


// ==============================
// FECHAR
// ==============================

fecharModalSuporte.addEventListener('click', () => {

    modalSuporte.classList.remove('ativo');

});


// ==============================
// ENVIAR
// ==============================

enviarSuporte.addEventListener('click', async () => {

    const descricao =
        descricaoSuporte.value.trim();


    erroSuporte.textContent = '';


    if (!descricao) {

        erroSuporte.textContent =
            'Descreva o problema antes de enviar.';

        return;

    }


    try {

        const resposta = await fetch(
            '/suporte/enviar',
            {

                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    descricao: descricao

                })

            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            erroSuporte.textContent =
                resultado.erro ||
                'Não foi possível enviar a solicitação.';

            return;

        }


        alert(
            'Sua solicitação foi enviada com sucesso!'
        );


        descricaoSuporte.value = '';

        modalSuporte.classList.remove('ativo');


    } catch (erro) {

        console.error(erro);

        erroSuporte.textContent =
            'Erro de comunicação com o servidor.';

    }

});

// ==============================
// MENU DE CONFIGURAÇÕES
// ==============================

const btnConfiguracoes =
    document.getElementById('btnConfiguracoes');

const configMenu =
    document.getElementById('configMenu');


if (btnConfiguracoes && configMenu) {

    // ABRIR / FECHAR
    btnConfiguracoes.addEventListener('click', (event) => {

        event.preventDefault();

        configMenu.classList.toggle('ativo');

    });


    // FECHAR AO CLICAR FORA
    document.addEventListener('click', (event) => {

        if (
            !btnConfiguracoes.contains(event.target) &&
            !configMenu.contains(event.target)
        ) {

            configMenu.classList.remove('ativo');

        }

    });

    // ==============================
// ADICIONAR USUÁRIO
// ==============================

const btnAdicionarUsuario =
    document.getElementById('btnAdicionarUsuario');

const modalAdicionarUsuario =
    document.getElementById('adicionarUsuarios_modal');

const fecharAdicionarUsuario =
    document.getElementById('fecharAdicionarUsuario');

const cancelarAdicionarUsuario =
    document.getElementById('cancelarAdicionarUsuario');

const formAdicionarUsuario =
    document.getElementById('formAdicionarUsuario');

const erroAdicionarUsuario =
    document.getElementById('erroAdicionarUsuario');


// ==============================
// ABRIR MODAL
// ==============================

if (
    btnAdicionarUsuario &&
    modalAdicionarUsuario
) {

    btnAdicionarUsuario.addEventListener(
        'click',
        (event) => {

            event.preventDefault();

            modalAdicionarUsuario.classList.add(
                'ativo'
            );

            // Fecha o menu da engrenagem
            if (configMenu) {
                configMenu.classList.remove(
                    'ativo'
                );
            }

        }
    );

}


// ==============================
// FECHAR PELO X
// ==============================

if (fecharAdicionarUsuario) {

    fecharAdicionarUsuario.addEventListener(
        'click',
        () => {

            modalAdicionarUsuario.classList.remove(
                'ativo'
            );

        }
    );

}


// ==============================
// FECHAR PELO CANCELAR
// ==============================

if (cancelarAdicionarUsuario) {

    cancelarAdicionarUsuario.addEventListener(
        'click',
        () => {

            modalAdicionarUsuario.classList.remove(
                'ativo'
            );

        }
    );

}


// ==============================
// FECHAR CLICANDO FORA
// ==============================

if (modalAdicionarUsuario) {

    modalAdicionarUsuario.addEventListener(
        'click',
        (event) => {

            if (
                event.target ===
                modalAdicionarUsuario
            ) {

                modalAdicionarUsuario.classList.remove(
                    'ativo'
                );

            }

        }
    );

}


// ==============================
// CRIAR USUÁRIO
// ==============================

if (formAdicionarUsuario) {

    formAdicionarUsuario.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();

            erroAdicionarUsuario.textContent = '';


            const formData =
                new FormData(
                    formAdicionarUsuario
                );


            try {

                const resposta =
                    await fetch(
                        '/cadastro/ceo/adicionar-usuario',
                        {
                            method: 'POST',
                            body: formData
                        }
                    );


                const resultado =
                    await resposta.json();


                // ==========================
                // ERRO
                // ==========================

                if (!resposta.ok) {

                    erroAdicionarUsuario.textContent =
                        resultado.erro ||
                        'Não foi possível criar o usuário.';

                    return;

                }


                // ==========================
                // SUCESSO
                // ==========================

                if (resultado.sucesso) {

                    alert(
                        'Usuário criado com sucesso!'
                    );


                    formAdicionarUsuario.reset();


                    modalAdicionarUsuario.classList.remove(
                        'ativo'
                    );

                }

            } catch (erro) {

                console.error(
                    'Erro ao criar usuário:',
                    erro
                );


                erroAdicionarUsuario.textContent =
                    'Erro de comunicação com o servidor.';

            }

        }
    );

}

}

// ==========================================================
// PERMISSÕES DOS USUÁRIOS
// ==========================================================

const btnPermissoesUsuario =
    document.getElementById('btnPermissoesUsuario');

const modalPermissoes =
    document.getElementById('modalPermissoes');

const fecharModalPermissoes =
    document.getElementById('fecharModalPermissoes');

const pesquisaPermissoes =
    document.getElementById('pesquisaPermissoes');

const listaPermissoes =
    document.getElementById('listaPermissoes');


// ==========================================================
// VARIÁVEIS
// ==========================================================

let usuariosPermissoes = [];


// ==========================================================
// NOMES DAS PERMISSÕES
// ==========================================================

const nomesPermissoes = {

    0: 'Usuário',

    1: 'CEO',

    2: 'Vendedor'

};


// ==========================================================
// ABRIR MODAL
// ==========================================================

if (
    btnPermissoesUsuario &&
    modalPermissoes
) {

    btnPermissoesUsuario.addEventListener(
        'click',
        async function (event) {

            event.preventDefault();

            console.log(
                'Abrindo modal de permissões'
            );


            // Fecha o menu de configurações
            if (configMenu) {

                configMenu.classList.remove(
                    'ativo'
                );

            }


            // Abre o modal
            modalPermissoes.classList.add(
                'ativo'
            );


            // Limpa a pesquisa
            if (pesquisaPermissoes) {

                pesquisaPermissoes.value = '';

            }


            // Carrega os usuários
            await carregarUsuariosPermissoes();

        }
    );

}


// ==========================================================
// FECHAR MODAL PELO X
// ==========================================================

if (
    fecharModalPermissoes &&
    modalPermissoes
) {

    fecharModalPermissoes.addEventListener(
        'click',
        function () {

            modalPermissoes.classList.remove(
                'ativo'
            );

        }
    );

}


// ==========================================================
// FECHAR MODAL CLICANDO FORA
// ==========================================================

if (modalPermissoes) {

    modalPermissoes.addEventListener(
        'click',
        function (event) {

            if (
                event.target === modalPermissoes
            ) {

                modalPermissoes.classList.remove(
                    'ativo'
                );

            }

        }
    );

}


// ==========================================================
// CARREGAR USUÁRIOS
// ==========================================================

async function carregarUsuariosPermissoes() {

    if (!listaPermissoes) {

        console.error(
            'Elemento listaPermissoes não encontrado.'
        );

        return;

    }


    listaPermissoes.innerHTML = `
        <p class="carregando-permissoes">
            Carregando usuários...
        </p>
    `;


    try {

        const resposta = await fetch(
            '/permissoes/usuarios'
        );


        const resultado =
            await resposta.json();


        // ==================================================
        // ERRO DO BACKEND
        // ==================================================

        if (!resposta.ok) {

            listaPermissoes.innerHTML = `
                <p class="erro-permissoes">
                    ${
                        resultado.erro ||
                        'Erro ao carregar usuários.'
                    }
                </p>
            `;

            return;

        }


        // ==================================================
        // GUARDA USUÁRIOS
        // ==================================================

        usuariosPermissoes =
            resultado;


        // ==================================================
        // MOSTRA USUÁRIOS
        // ==================================================

        renderizarUsuariosPermissoes(
            usuariosPermissoes
        );


    } catch (erro) {

        console.error(
            'Erro ao carregar usuários:',
            erro
        );


        listaPermissoes.innerHTML = `
            <p class="erro-permissoes">
                Erro de comunicação com o servidor.
            </p>
        `;

    }

}


// ==========================================================
// RENDERIZAR USUÁRIOS
// ==========================================================

function renderizarUsuariosPermissoes(
    usuarios
) {

    if (!listaPermissoes) {
        return;
    }


    listaPermissoes.innerHTML = '';


    // ======================================================
    // NENHUM USUÁRIO
    // ======================================================

    if (
        !usuarios ||
        usuarios.length === 0
    ) {

        listaPermissoes.innerHTML = `
            <p class="sem-usuarios">
                Nenhum usuário encontrado.
            </p>
        `;

        return;

    }


    // ======================================================
    // CRIA CADA USUÁRIO
    // ======================================================

    usuarios.forEach(
        function (usuario) {

            const item =
                document.createElement(
                    'div'
                );


            item.classList.add(
                'usuario-permissao'
            );


            // Converte para número
            const tipoUsuario =
                Number(
                    usuario.tipo_usuario
                );


            // Nome da permissão atual
            const permissaoAtual =
                nomesPermissoes[tipoUsuario]
                || 'Desconhecida';


            item.innerHTML = `

                <!-- ==================================
                     LINHA DO USUÁRIO
                =================================== -->

                <div class="usuario-permissao-topo">

                    <div class="usuario-permissao-info">

                        <strong>
                            ${usuario.nome}
                        </strong>

                        <span>
                            ${usuario.email}
                        </span>

                    </div>


                    <!-- SETA -->

                    <button
                        type="button"
                        class="btn-expandir-permissao"
                        data-id="${usuario.id}"
                        aria-label="Alterar permissão">

                        <span>
                            ›
                        </span>

                    </button>

                </div>


                <!-- ==================================
                     PERMISSÃO ATUAL
                     SEMPRE VISÍVEL
                =================================== -->

                <div class="permissao-atual">

                    Permissão atual:

                    <strong>
                        ${permissaoAtual}
                    </strong>

                </div>


                <!-- ==================================
                     OUTRAS OPÇÕES
                     COMEÇAM ESCONDIDAS
                =================================== -->

                <div
                    class="usuario-permissao-opcoes"
                    id="opcoes-permissao-${usuario.id}">

                    ${criarOpcoesPermissao(usuario)}

                </div>

            `;


            listaPermissoes.appendChild(
                item
            );

        }
    );


    // ======================================================
    // CONFIGURA EVENTOS DOS ELEMENTOS CRIADOS
    // ======================================================

    configurarBotoesExpansao();

    configurarOpcoesPermissao();

}


// ==========================================================
// CRIAR AS OUTRAS OPÇÕES DE PERMISSÃO
// ==========================================================

function criarOpcoesPermissao(
    usuario
) {

    let html = '';


    const permissaoAtual =
        Number(
            usuario.tipo_usuario
        );


    Object.entries(
        nomesPermissoes
    ).forEach(
        function ([valor, nome]) {

            const permissao =
                Number(valor);


            // ==================================================
            // NÃO MOSTRA A PERMISSÃO QUE ELE JÁ POSSUI
            // ==================================================

            if (
                permissao ===
                permissaoAtual
            ) {

                return;

            }


            html += `

                <button
                    type="button"
                    class="btn-opcao-permissao"
                    data-usuario="${usuario.id}"
                    data-permissao="${permissao}">

                    ${nome}

                </button>

            `;

        }
    );


    return html;

}


// ==========================================================
// CONFIGURAR SETAS
// ==========================================================

function configurarBotoesExpansao() {

    const botoes =
        listaPermissoes.querySelectorAll(
            '.btn-expandir-permissao'
        );


    botoes.forEach(
        function (botao) {

            botao.addEventListener(
                'click',
                function () {

                    const usuarioId =
                        botao.dataset.id;


                    const opcoes =
                        document.getElementById(
                            `opcoes-permissao-${usuarioId}`
                        );


                    if (!opcoes) {

                        console.error(
                            'Opções do usuário não encontradas:',
                            usuarioId
                        );

                        return;

                    }


                    // ==========================================
                    // FECHA OS OUTROS USUÁRIOS
                    // ==========================================

                    const todasOpcoes =
                        listaPermissoes.querySelectorAll(
                            '.usuario-permissao-opcoes'
                        );


                    todasOpcoes.forEach(
                        function (outraOpcao) {

                            if (
                                outraOpcao !== opcoes
                            ) {

                                outraOpcao.classList.remove(
                                    'ativo'
                                );

                            }

                        }
                    );


                    const todasSetas =
                        listaPermissoes.querySelectorAll(
                            '.btn-expandir-permissao'
                        );


                    todasSetas.forEach(
                        function (outraSeta) {

                            if (
                                outraSeta !== botao
                            ) {

                                outraSeta.classList.remove(
                                    'aberto'
                                );

                            }

                        }
                    );


                    // ==========================================
                    // ABRE / FECHA O USUÁRIO CLICADO
                    // ==========================================

                    opcoes.classList.toggle(
                        'ativo'
                    );


                    botao.classList.toggle(
                        'aberto'
                    );

                }
            );

        }
    );

}


// ==========================================================
// CONFIGURAR BOTÕES DAS PERMISSÕES
// ==========================================================

function configurarOpcoesPermissao() {

    const botoes =
        listaPermissoes.querySelectorAll(
            '.btn-opcao-permissao'
        );


    botoes.forEach(
        function (botao) {

            botao.addEventListener(
                'click',
                async function () {

                    const usuarioId =
                        botao.dataset.usuario;


                    const novaPermissao =
                        Number(
                            botao.dataset.permissao
                        );


                    await alterarPermissao(
                        usuarioId,
                        novaPermissao
                    );

                }
            );

        }
    );

}


// ==========================================================
// ALTERAR PERMISSÃO NO BANCO
// ==========================================================

async function alterarPermissao(
    usuarioId,
    novaPermissao
) {

    try {

        const resposta =
            await fetch(
                '/permissoes/alterar',
                {

                    method: 'POST',

                    headers: {

                        'Content-Type':
                            'application/json'

                    },

                    body: JSON.stringify({

                        usuario_id:
                            Number(usuarioId),

                        tipo_usuario:
                            Number(novaPermissao)

                    })

                }
            );


        const resultado =
            await resposta.json();


        // ==================================================
        // ERRO
        // ==================================================

        if (!resposta.ok) {

            alert(
                resultado.erro ||
                'Não foi possível alterar a permissão.'
            );

            return;

        }


        // ==================================================
        // SUCESSO
        // ==================================================

        if (resultado.sucesso) {

            console.log(
                'Permissão alterada com sucesso.'
            );


            // Recarrega os dados do banco
            await carregarUsuariosPermissoes();

        }


    } catch (erro) {

        console.error(
            'Erro ao alterar permissão:',
            erro
        );


        alert(
            'Erro de comunicação com o servidor.'
        );

    }

}


// ==========================================================
// PESQUISAR USUÁRIO
// ==========================================================

if (pesquisaPermissoes) {

    pesquisaPermissoes.addEventListener(
        'input',
        function () {

            const pesquisa =
                pesquisaPermissoes.value
                    .toLowerCase()
                    .trim();


            // ==================================================
            // FILTRA NOME E E-MAIL
            // ==================================================

            const usuariosFiltrados =
                usuariosPermissoes.filter(
                    function (usuario) {

                        const nome =
                            String(
                                usuario.nome || ''
                            )
                            .toLowerCase();


                        const email =
                            String(
                                usuario.email || ''
                            )
                            .toLowerCase();


                        return (

                            nome.includes(
                                pesquisa
                            )

                            ||

                            email.includes(
                                pesquisa
                            )

                        );

                    }
                );


            // ==================================================
            // MOSTRA RESULTADO
            // ==================================================

            renderizarUsuariosPermissoes(
                usuariosFiltrados
            );

        }
    );

}

// ==========================================================
// EDITAR CATEGORIA
// ==========================================================

const modalEditarCategoria =
    document.getElementById('modalEditarCategoria');

const fecharEditarCategoria =
    document.getElementById('fecharEditarCategoria');

const cancelarEditarCategoria =
    document.getElementById('cancelarEditarCategoria');

const formEditarCategoria =
    document.getElementById('formEditarCategoria');

const editarCategoriaId =
    document.getElementById('editarCategoriaId');

const editarCategoriaNome =
    document.getElementById('editarCategoriaNome');

const editarCategoriaFoto =
    document.getElementById('editarCategoriaFoto');

const previewEditarCategoria =
    document.getElementById('previewEditarCategoria');

const erroEditarCategoria =
    document.getElementById('erroEditarCategoria');


// ==========================================================
// BOTÕES DE ENGRENAGEM
// ==========================================================

const botoesConfigCategoria =
    document.querySelectorAll(
        '.btn-config-categoria'
    );


botoesConfigCategoria.forEach(
    function (botao) {

        botao.addEventListener(
            'click',
            function () {

                const id =
                    botao.dataset.id;

                const nome =
                    botao.dataset.nome;

                const foto =
                    botao.dataset.foto;


                // Preenche dados

                editarCategoriaId.value =
                    id;

                editarCategoriaNome.value =
                    nome;

                previewEditarCategoria.src =
                    foto;


                // Limpa arquivo selecionado

                editarCategoriaFoto.value =
                    '';


                // Limpa erro

                erroEditarCategoria.textContent =
                    '';


                // Abre modal

                modalEditarCategoria.classList.add(
                    'ativo'
                );

            }
        );

    }
);


// ==========================================================
// PREVIEW DA NOVA FOTO
// ==========================================================

if (editarCategoriaFoto) {

    editarCategoriaFoto.addEventListener(
        'change',
        function () {

            const arquivo =
                editarCategoriaFoto.files[0];


            if (!arquivo) {
                return;
            }


            const url =
                URL.createObjectURL(
                    arquivo
                );


            previewEditarCategoria.src =
                url;

        }
    );

}


// ==========================================================
// FECHAR PELO X
// ==========================================================

if (fecharEditarCategoria) {

    fecharEditarCategoria.addEventListener(
        'click',
        function () {

            modalEditarCategoria.classList.remove(
                'ativo'
            );

        }
    );

}


// ==========================================================
// CANCELAR
// ==========================================================

if (cancelarEditarCategoria) {

    cancelarEditarCategoria.addEventListener(
        'click',
        function () {

            modalEditarCategoria.classList.remove(
                'ativo'
            );

        }
    );

}


// ==========================================================
// FECHAR CLICANDO FORA
// ==========================================================

if (modalEditarCategoria) {

    modalEditarCategoria.addEventListener(
        'click',
        function (event) {

            if (
                event.target ===
                modalEditarCategoria
            ) {

                modalEditarCategoria.classList.remove(
                    'ativo'
                );

            }

        }
    );

}

// ==========================================================
// SALVAR ALTERAÇÕES
// ==========================================================

if (formEditarCategoria) {

    formEditarCategoria.addEventListener(
        'submit',
        async function (event) {

            event.preventDefault();


            erroEditarCategoria.textContent =
                '';


            const nome =
                editarCategoriaNome.value.trim();


            if (!nome) {

                erroEditarCategoria.textContent =
                    'O nome é obrigatório.';

                return;

            }


            const formData =
                new FormData();


            formData.append(
                'categoria_id',
                editarCategoriaId.value
            );


            formData.append(
                'nome',
                nome
            );


            if (
                editarCategoriaFoto.files.length > 0
            ) {

                formData.append(
                    'foto',
                    editarCategoriaFoto.files[0]
                );

            }


            try {

                const resposta =
                    await fetch(
                        '/categoria/editar',
                        {
                            method: 'POST',
                            body: formData
                        }
                    );


                const resultado =
                    await resposta.json();


                console.log(
                    'STATUS:',
                    resposta.status
                );

                console.log(
                    'RESPOSTA:',
                    resultado
                );


                if (!resposta.ok) {

                    erroEditarCategoria.textContent =
                        resultado.erro ||
                        'Não foi possível editar a categoria.';

                    return;

                }


                if (
                    resultado.sucesso
                ) {

                    modalEditarCategoria.classList.remove(
                        'ativo'
                    );


                    location.reload();

                }


            } catch (erro) {

                console.error(
                    'Erro ao editar categoria:',
                    erro
                );


                erroEditarCategoria.textContent =
                    'Erro de comunicação com o servidor.';

            }

        }
    );

}

// ==========================================================
// DELETAR CATEGORIA
// ==========================================================

const btnDeletarCategoria =
    document.getElementById(
        'btnDeletarCategoria'
    );


if (btnDeletarCategoria) {

    btnDeletarCategoria.addEventListener(
        'click',
        async function () {

            const categoriaId =
                editarCategoriaId.value;


            const nomeCategoria =
                editarCategoriaNome.value.trim();


            if (!categoriaId) {

                erroEditarCategoria.textContent =
                    'Categoria inválida.';

                return;

            }


            // ==============================================
            // CONFIRMAÇÃO
            // ==============================================

            const confirmar =
                confirm(
                    `Deseja realmente deletar a categoria "${nomeCategoria}"?`
                );


            if (!confirmar) {
                return;
            }


            erroEditarCategoria.textContent =
                '';


            try {

                const resposta =
                    await fetch(
                        `/categoria/${categoriaId}`,
                        {
                            method: 'DELETE'
                        }
                    );


                const resultado =
                    await resposta.json();


                // ==========================================
                // ERRO
                // ==========================================

                if (!resposta.ok) {

                    erroEditarCategoria.textContent =
                        resultado.erro ||
                        'Não foi possível deletar a categoria.';

                    return;

                }


                // ==========================================
                // SUCESSO
                // ==========================================

                if (resultado.sucesso) {

                    modalEditarCategoria.classList.remove(
                        'ativo'
                    );


                    location.reload();

                }


            } catch (erro) {

                console.error(
                    'Erro ao deletar categoria:',
                    erro
                );


                erroEditarCategoria.textContent =
                    'Erro de comunicação com o servidor.';

            }

        }
    );

}

// ==========================================================
// EDITAR USUÁRIOS
// ==========================================================

const btnEditarUsuario =
    document.getElementById('btnEditarUsuario');

const submenuEditarUsuarios =
    document.getElementById('submenuEditarUsuarios');

const botoesTipoEditarUsuario =
    document.querySelectorAll(
        '.btn-tipo-editar-usuario'
    );


// ==========================================================
// MODAL DA LISTA
// ==========================================================

const modalListaEditarUsuario =
    document.getElementById(
        'editarUsuario_modal'
    );

const fecharListaEditarUsuario =
    document.getElementById(
        'fecharListaEditarUsuario'
    );

const tituloListaEditarUsuario =
    document.getElementById(
        'tituloListaEditarUsuario'
    );

const listaEditarUsuarios =
    document.getElementById(
        'listaEditarUsuarios'
    );

const pesquisaEditarUsuario =
    document.getElementById(
        'pesquisaEditarUsuario'
    );


// ==========================================================
// MODAL DO USUÁRIO SELECIONADO
// ==========================================================

const modalEditarUsuarioSelecionado =
    document.getElementById(
        'modalEditarUsuarioSelecionado'
    );

const fecharEditarUsuarioSelecionado =
    document.getElementById(
        'fecharEditarUsuarioSelecionado'
    );

const cancelarEditarUsuario =
    document.getElementById(
        'cancelarEditarUsuario'
    );

const formEditarUsuarioSelecionado =
    document.getElementById(
        'formEditarUsuarioSelecionado'
    );

const editarUsuarioId =
    document.getElementById(
        'editarUsuarioId'
    );

const editarUsuarioNome =
    document.getElementById(
        'editarUsuarioNome'
    );

const editarUsuarioEmail =
    document.getElementById(
        'editarUsuarioEmail'
    );

const erroEditarUsuario =
    document.getElementById(
        'erroEditarUsuario'
    );


// ==========================================================
// VARIÁVEIS
// ==========================================================

let usuariosEdicao = [];

let permissaoSelecionada = null;


// ==========================================================
// ABRIR / FECHAR SUBMENU
// ==========================================================

if (
    btnEditarUsuario &&
    submenuEditarUsuarios
) {

    btnEditarUsuario.addEventListener(
        'click',
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            submenuEditarUsuarios.classList.toggle(
                'ativo'
            );

        }
    );


    submenuEditarUsuarios.addEventListener(
        'click',
        function (event) {

            event.stopPropagation();

        }
    );

}


// ==========================================================
// CLICAR EM GERENTES / USUÁRIOS / VENDEDORES
// ==========================================================

botoesTipoEditarUsuario.forEach(
    function (botao) {

        botao.addEventListener(
            'click',
            async function (event) {

                event.preventDefault();
                event.stopPropagation();


                permissaoSelecionada =
                    Number(
                        botao.dataset.permissao
                    );


                const titulo =
                    botao.dataset.titulo;


                // Fecha submenu

                submenuEditarUsuarios.classList.remove(
                    'ativo'
                );


                // Fecha menu de configurações

                if (configMenu) {

                    configMenu.classList.remove(
                        'ativo'
                    );

                }


                // Título do modal

                tituloListaEditarUsuario.textContent =
                    titulo;


                // Limpa pesquisa

                if (pesquisaEditarUsuario) {

                    pesquisaEditarUsuario.value =
                        '';

                }


                // Abre modal

                modalListaEditarUsuario.classList.add(
                    'ativo'
                );


                // Carrega usuários

                await carregarUsuariosParaEdicao(
                    permissaoSelecionada
                );

            }
        );

    }
);


// ==========================================================
// CARREGAR USUÁRIOS POR PERMISSÃO
// ==========================================================

async function carregarUsuariosParaEdicao(
    permissao
) {

    if (!listaEditarUsuarios) {
        return;
    }


    listaEditarUsuarios.innerHTML = `
        <p class="carregando-editar-usuario">
            Carregando usuários...
        </p>
    `;


    try {

        const resposta =
            await fetch(
                `/editar-usuario/listar/${permissao}`
            );


        const resultado =
            await resposta.json();


        console.log(
            'Usuários recebidos:',
            resultado
        );


        if (!resposta.ok) {

            listaEditarUsuarios.innerHTML = `
                <p class="erro-lista-usuario">
                    ${
                        resultado.erro ||
                        'Erro ao carregar usuários.'
                    }
                </p>
            `;

            return;

        }


        usuariosEdicao =
            resultado;


        renderizarUsuariosEdicao(
            usuariosEdicao
        );


    } catch (erro) {

        console.error(
            'Erro ao carregar usuários:',
            erro
        );


        listaEditarUsuarios.innerHTML = `
            <p class="erro-lista-usuario">
                Erro de comunicação com o servidor.
            </p>
        `;

    }

}


// ==========================================================
// RENDERIZAR USUÁRIOS
// ==========================================================

function renderizarUsuariosEdicao(
    usuarios
) {

    if (!listaEditarUsuarios) {
        return;
    }


    listaEditarUsuarios.innerHTML =
        '';


    if (
        !usuarios ||
        usuarios.length === 0
    ) {

        listaEditarUsuarios.innerHTML = `
            <p class="sem-usuarios-edicao">
                Nenhum usuário encontrado.
            </p>
        `;

        return;

    }


    usuarios.forEach(
        function (usuario) {

            const item =
                document.createElement(
                    'button'
                );


            item.type =
                'button';


            item.classList.add(
                'item-editar-usuario'
            );


            item.dataset.id =
                usuario.id;


            item.innerHTML = `

                <div class="item-editar-usuario-info">

                    <strong>
                        ${usuario.nome}
                    </strong>

                    <span>
                        ${usuario.email}
                    </span>

                </div>


                <span class="seta-usuario-edicao">
                    ›
                </span>

            `;


            // ==========================================
            // CLICAR NO USUÁRIO
            // ==========================================

            item.addEventListener(
                'click',
                async function () {

                    await abrirUsuarioParaEdicao(
                        usuario.id
                    );

                }
            );


            listaEditarUsuarios.appendChild(
                item
            );

        }
    );

}


// ==========================================================
// ABRIR USUÁRIO ESPECÍFICO
// ==========================================================

async function abrirUsuarioParaEdicao(
    usuarioId
) {

    try {

        const resposta =
            await fetch(
                `/editar-usuario/${usuarioId}`
            );


        const usuario =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                usuario.erro ||
                'Não foi possível carregar o usuário.'
            );

            return;

        }


        // ==========================================
        // PREENCHE O MODAL
        // ==========================================

        editarUsuarioId.value =
            usuario.id;


        editarUsuarioNome.value =
            usuario.nome;


        editarUsuarioEmail.value =
            usuario.email;


        if (erroEditarUsuario) {

            erroEditarUsuario.textContent =
                '';

        }


        // ==========================================
        // FECHA MODAL DA LISTA
        // ==========================================

        modalListaEditarUsuario.classList.remove(
            'ativo'
        );


        // ==========================================
        // ABRE MODAL DE EDIÇÃO
        // ==========================================

        modalEditarUsuarioSelecionado.classList.add(
            'ativo'
        );


    } catch (erro) {

        console.error(
            'Erro ao buscar usuário:',
            erro
        );


        alert(
            'Erro de comunicação com o servidor.'
        );

    }

}


// ==========================================================
// SALVAR ALTERAÇÕES DO USUÁRIO
// ==========================================================

if (formEditarUsuarioSelecionado) {

    formEditarUsuarioSelecionado.addEventListener(
        'submit',
        async function (event) {

            event.preventDefault();


            const usuarioId =
                editarUsuarioId.value;


            const nome =
                editarUsuarioNome.value.trim();


            const email =
                editarUsuarioEmail.value.trim();


            if (erroEditarUsuario) {

                erroEditarUsuario.textContent =
                    '';

            }


            // ==========================================
            // VALIDAÇÕES
            // ==========================================

            if (!nome) {

                erroEditarUsuario.textContent =
                    'O nome é obrigatório.';

                return;

            }


            if (!email) {

                erroEditarUsuario.textContent =
                    'O e-mail é obrigatório.';

                return;

            }


            try {

                const resposta =
                    await fetch(
                        `/editar-usuario/${usuarioId}`,
                        {

                            method: 'POST',

                            headers: {

                                'Content-Type':
                                    'application/json'

                            },

                            body: JSON.stringify({

                                nome:
                                    nome,

                                email:
                                    email

                            })

                        }
                    );


                const resultado =
                    await resposta.json();


                // ==========================================
                // ERRO
                // ==========================================

                if (!resposta.ok) {

                    erroEditarUsuario.textContent =
                        resultado.erro ||
                        'Não foi possível editar o usuário.';

                    return;

                }


                // ==========================================
                // SUCESSO
                // ==========================================

                if (resultado.sucesso) {

                    modalEditarUsuarioSelecionado
                        .classList.remove(
                            'ativo'
                        );


                    // Reabre a lista
                    // já atualizada

                    if (
                        permissaoSelecionada !== null
                    ) {

                        modalListaEditarUsuario
                            .classList.add(
                                'ativo'
                            );


                        await carregarUsuariosParaEdicao(
                            permissaoSelecionada
                        );

                    }

                }


            } catch (erro) {

                console.error(
                    'Erro ao editar usuário:',
                    erro
                );


                erroEditarUsuario.textContent =
                    'Erro de comunicação com o servidor.';

            }

        }
    );

}


// ==========================================================
// PESQUISA
// ==========================================================

if (pesquisaEditarUsuario) {

    pesquisaEditarUsuario.addEventListener(
        'input',
        function () {

            const pesquisa =
                pesquisaEditarUsuario.value
                    .toLowerCase()
                    .trim();


            const usuariosFiltrados =
                usuariosEdicao.filter(
                    function (usuario) {

                        const nome =
                            String(
                                usuario.nome || ''
                            )
                            .toLowerCase();


                        const email =
                            String(
                                usuario.email || ''
                            )
                            .toLowerCase();


                        return (

                            nome.includes(
                                pesquisa
                            )

                            ||

                            email.includes(
                                pesquisa
                            )

                        );

                    }
                );


            renderizarUsuariosEdicao(
                usuariosFiltrados
            );

        }
    );

}


// ==========================================================
// FECHAR MODAL DA LISTA
// ==========================================================

if (
    fecharListaEditarUsuario &&
    modalListaEditarUsuario
) {

    fecharListaEditarUsuario.addEventListener(
        'click',
        function () {

            modalListaEditarUsuario.classList.remove(
                'ativo'
            );

        }
    );

}


// ==========================================================
// FECHAR LISTA CLICANDO FORA
// ==========================================================

if (modalListaEditarUsuario) {

    modalListaEditarUsuario.addEventListener(
        'click',
        function (event) {

            if (
                event.target ===
                modalListaEditarUsuario
            ) {

                modalListaEditarUsuario.classList.remove(
                    'ativo'
                );

            }

        }
    );

}


// ==========================================================
// FECHAR MODAL DO USUÁRIO
// ==========================================================

if (
    fecharEditarUsuarioSelecionado &&
    modalEditarUsuarioSelecionado
) {

    fecharEditarUsuarioSelecionado.addEventListener(
        'click',
        function () {

            modalEditarUsuarioSelecionado.classList.remove(
                'ativo'
            );

        }
    );

}


// ==========================================================
// CANCELAR EDIÇÃO
// ==========================================================

if (
    cancelarEditarUsuario &&
    modalEditarUsuarioSelecionado
) {

    cancelarEditarUsuario.addEventListener(
        'click',
        function () {

            modalEditarUsuarioSelecionado.classList.remove(
                'ativo'
            );


            // Volta para lista

            modalListaEditarUsuario.classList.add(
                'ativo'
            );

        }
    );

}


// ==========================================================
// FECHAR EDIÇÃO CLICANDO FORA
// ==========================================================

if (modalEditarUsuarioSelecionado) {

    modalEditarUsuarioSelecionado.addEventListener(
        'click',
        function (event) {

            if (
                event.target ===
                modalEditarUsuarioSelecionado
            ) {

                modalEditarUsuarioSelecionado.classList.remove(
                    'ativo'
                );

            }

        }
    );

}

const botoesAcessarCategoria =
    document.querySelectorAll(
        '.btn-acessar-categoria'
    );


botoesAcessarCategoria.forEach(
    function (botao) {

        botao.addEventListener(
            'click',
            function () {

                const tipoId =
                    botao.dataset.id;


                window.location.href =
                    `/ceo/vendedores/${tipoId}`;

            }
        );

    }
);