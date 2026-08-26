document.addEventListener(
    'DOMContentLoaded',
    function () {

        // ==========================================
        // ELEMENTOS - PRIMEIRO MODAL
        // ==========================================

        const btnAdicionarVendedor =
            document.getElementById(
                'btnAdicionarVendedor'
            );

        const modalAdicionarVendedor =
            document.getElementById(
                'modalAdicionarVendedor'
            );

        const fecharModalAdicionarVendedor =
            document.getElementById(
                'fecharModalAdicionarVendedor'
            );

        const pesquisaVendedor =
            document.getElementById(
                'pesquisaVendedor'
            );

        const listaVendedoresDisponiveis =
            document.getElementById(
                'listaVendedoresDisponiveis'
            );

        const erroAdicionarVendedor =
            document.getElementById(
                'erroAdicionarVendedor'
            );

        const tipoImobiliariaId =
            document.getElementById(
                'tipoImobiliariaId'
            );


        // ==========================================
        // ELEMENTOS - SEGUNDO MODAL
        // ==========================================

        const modalCadastrarVendedorCategoria =
            document.getElementById(
                'modalCadastrarVendedorCategoria'
            );

        const fecharCadastrarVendedor =
            document.getElementById(
                'fecharCadastrarVendedor'
            );

        const cancelarCadastrarVendedor =
            document.getElementById(
                'cancelarCadastrarVendedor'
            );

        const formCadastrarVendedorCategoria =
            document.getElementById(
                'formCadastrarVendedorCategoria'
            );

        const vendedorSelecionadoId =
            document.getElementById(
                'vendedorSelecionadoId'
            );

        const categoriaSelecionadaId =
            document.getElementById(
                'categoriaSelecionadaId'
            );

        const nomeVendedorSelecionado =
            document.getElementById(
                'nomeVendedorSelecionado'
            );

        const fotoVendedor =
            document.getElementById(
                'fotoVendedor'
            );

        const previewFotoVendedor =
            document.getElementById(
                'previewFotoVendedor'
            );

        const previewFotoVendedorContainer =
            document.getElementById(
                'previewFotoVendedorContainer'
            );

        const estrelasVendedor =
            document.getElementById(
                'estrelasVendedor'
            );

        const tempoAreaVendedor =
            document.getElementById(
                'tempoAreaVendedor'
            );

        const quantidadeVendasVendedor =
            document.getElementById(
                'quantidadeVendasVendedor'
            );

        const telefoneVendedor =
            document.getElementById(
                'telefoneVendedor'
            );

        const descricaoVendedor =
            document.getElementById(
                'descricaoVendedor'
            );

        const erroCadastrarVendedor =
            document.getElementById(
                'erroCadastrarVendedor'
            );


        // ==========================================
        // VARIÁVEIS
        // ==========================================

        let vendedoresDisponiveis = [];


        console.log(
            'CEO vendedores JS carregado'
        );


        // ==========================================
        // ABRIR PRIMEIRO MODAL
        // ==========================================

        if (
            btnAdicionarVendedor &&
            modalAdicionarVendedor
        ) {

            btnAdicionarVendedor.addEventListener(
                'click',
                async function () {

                    console.log(
                        'Abrindo modal de vendedores'
                    );


                    if (pesquisaVendedor) {

                        pesquisaVendedor.value =
                            '';

                    }


                    if (erroAdicionarVendedor) {

                        erroAdicionarVendedor.textContent =
                            '';

                    }


                    modalAdicionarVendedor.classList.add(
                        'ativo'
                    );


                    await carregarVendedoresDisponiveis();

                }
            );

        }


        // ==========================================
        // CARREGAR VENDEDORES DO BACKEND
        // ==========================================

        async function carregarVendedoresDisponiveis() {

            if (
                !tipoImobiliariaId ||
                !listaVendedoresDisponiveis
            ) {

                console.error(
                    'Elementos do modal não encontrados.'
                );

                return;

            }


            const tipoId =
                tipoImobiliariaId.value;


            console.log(
                'TIPO ID:',
                tipoId
            );


            listaVendedoresDisponiveis.innerHTML = `
                <p class="carregando-vendedores">
                    Carregando vendedores...
                </p>
            `;


            try {

                const resposta =
                    await fetch(
                        `/ceo/vendedores/${tipoId}/disponiveis`
                    );


                console.log(
                    'STATUS:',
                    resposta.status
                );


                const resultado =
                    await resposta.json();


                console.log(
                    'VENDEDORES RECEBIDOS:',
                    resultado
                );


                if (!resposta.ok) {

                    listaVendedoresDisponiveis.innerHTML = `
                        <p class="erro-adicionar-vendedor">
                            ${
                                resultado.erro ||
                                'Erro ao carregar vendedores.'
                            }
                        </p>
                    `;

                    return;

                }


                vendedoresDisponiveis =
                    resultado;


                renderizarVendedoresDisponiveis(
                    vendedoresDisponiveis
                );


            } catch (erro) {

                console.error(
                    'Erro ao buscar vendedores:',
                    erro
                );


                listaVendedoresDisponiveis.innerHTML = `
                    <p class="erro-adicionar-vendedor">
                        Erro de comunicação com o servidor.
                    </p>
                `;

            }

        }


        function gerarEstrelas(valor) {

            valor = Number(valor) || 0;

            let html = '';

            const cheias = Math.floor(valor);
            const temMeia = valor % 1 >= 0.5;

            for (let i = 0; i < cheias; i++) {
                html += '<span class="estrela cheia">★</span>';
            }

            if (temMeia) {
                html += '<span class="estrela meia">★</span>';
            }

            const usadas =
                cheias + (temMeia ? 1 : 0);

            for (let i = usadas; i < 5; i++) {
                html += '<span class="estrela vazia">★</span>';
            }

            return html;
        }

        document
    .querySelectorAll(
        '.avaliacao-vendedor'
    )
    .forEach(
        function (avaliacao) {

            const valor =
                avaliacao.dataset.estrelas;

            const container =
                avaliacao.querySelector(
                    '.estrelas-card'
                );

            if (container) {

                container.innerHTML =
                    gerarEstrelas(valor);

            }

        }
    );

        // ==========================================
        // RENDERIZAR VENDEDORES
        // ==========================================

        function renderizarVendedoresDisponiveis(
            vendedores
        ) {

            listaVendedoresDisponiveis.innerHTML =
                '';


            if (
                !vendedores ||
                vendedores.length === 0
            ) {

                listaVendedoresDisponiveis.innerHTML = `
                    <p class="sem-vendedores">
                        Nenhum vendedor disponível.
                    </p>
                `;

                return;

            }


            vendedores.forEach(
                function (vendedor) {

                    const item =
                        document.createElement(
                            'div'
                        );


                    item.classList.add(
                        'vendedor-disponivel-item'
                    );


                    item.innerHTML = `

                        <div class="vendedor-disponivel-info">
                    
                            <strong>
                                ${vendedor.nome}
                            </strong>
                    
                            <span class="vendedor-email">
                                ${vendedor.email}
                            </span>
                    
                        </div>
                    
                        <button
                            type="button"
                            class="btn-adicionar-vendedor-lista"
                            data-id="${vendedor.id}">
                    
                            Adicionar
                    
                        </button>
                    
                    `;


                    listaVendedoresDisponiveis.appendChild(
                        item
                    );

                }
            );


            configurarBotoesAdicionarVendedor();

        }


        // ==========================================
        // CLICAR EM ADICIONAR
        // ==========================================

        function configurarBotoesAdicionarVendedor() {

            const botoes =
                document.querySelectorAll(
                    '.btn-adicionar-vendedor-lista'
                );


            botoes.forEach(
                function (botao) {

                    botao.addEventListener(
                        'click',
                        function () {

                            const usuarioId =
                                Number(
                                    botao.dataset.id
                                );


                            const vendedor =
                                vendedoresDisponiveis.find(
                                    function (item) {

                                        return Number(
                                            item.id
                                        ) === usuarioId;

                                    }
                                );


                            if (!vendedor) {

                                console.error(
                                    'Vendedor não encontrado.'
                                );

                                return;

                            }


                            console.log(
                                'Vendedor selecionado:',
                                vendedor
                            );


                            // ==================================
                            // IDS
                            // ==================================

                            vendedorSelecionadoId.value =
                                vendedor.id;


                            categoriaSelecionadaId.value =
                                tipoImobiliariaId.value;


                            // ==================================
                            // NOME
                            // ==================================

                            nomeVendedorSelecionado.textContent =
                                vendedor.nome;


                            // ==================================
                            // CAMPOS DA CATEGORIA
                            // ==================================

                            estrelasVendedor.value =
                                '';

                            tempoAreaVendedor.value =
                                '';

                            quantidadeVendasVendedor.value =
                                0;


                            // ==================================
                            // DADOS GERAIS DO VENDEDOR
                            // ==================================

                            telefoneVendedor.value =
                                vendedor.whatsapp || '';


                            descricaoVendedor.value =
                                vendedor.descricao || '';


                            // ==================================
                            // FOTO
                            // ==================================

                            fotoVendedor.value =
                                '';


                            if (vendedor.foto) {

                                previewFotoVendedor.src =
                                    `/static/imagens/usuarios/${vendedor.foto}`;


                                previewFotoVendedorContainer.style.display =
                                    'flex';

                            } else {

                                previewFotoVendedor.src =
                                    '';


                                previewFotoVendedorContainer.style.display =
                                    'none';

                            }


                            // ==================================
                            // LIMPA ERRO
                            // ==================================

                            if (erroCadastrarVendedor) {

                                erroCadastrarVendedor.textContent =
                                    '';

                            }


                            // ==================================
                            // FECHA PRIMEIRO MODAL
                            // ==================================

                            modalAdicionarVendedor.classList.remove(
                                'ativo'
                            );


                            // ==================================
                            // ABRE SEGUNDO MODAL
                            // ==================================

                            modalCadastrarVendedorCategoria.classList.add(
                                'ativo'
                            );

                        }
                    );

                }
            );

        }


        // ==========================================
        // PESQUISA
        // ==========================================

        if (pesquisaVendedor) {

            pesquisaVendedor.addEventListener(
                'input',
                function () {

                    const pesquisa =
                        pesquisaVendedor.value
                            .toLowerCase()
                            .trim();


                    const filtrados =
                        vendedoresDisponiveis.filter(
                            function (vendedor) {

                                const nome =
                                    String(
                                        vendedor.nome || ''
                                    )
                                    .toLowerCase();


                                const email =
                                    String(
                                        vendedor.email || ''
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


                    renderizarVendedoresDisponiveis(
                        filtrados
                    );

                }
            );

        }


        // ==========================================
        // PREVIEW FOTO
        // ==========================================

        if (fotoVendedor) {

            fotoVendedor.addEventListener(
                'change',
                function () {

                    const arquivo =
                        fotoVendedor.files[0];


                    if (!arquivo) {

                        return;

                    }


                    previewFotoVendedor.src =
                        URL.createObjectURL(
                            arquivo
                        );


                    previewFotoVendedorContainer.style.display =
                        'flex';

                }
            );

        }


        // ==========================================
        // FECHAR PRIMEIRO MODAL
        // ==========================================

        if (
            fecharModalAdicionarVendedor &&
            modalAdicionarVendedor
        ) {

            fecharModalAdicionarVendedor.addEventListener(
                'click',
                function () {

                    modalAdicionarVendedor.classList.remove(
                        'ativo'
                    );

                }
            );

        }


        // ==========================================
        // FECHAR PRIMEIRO MODAL CLICANDO FORA
        // ==========================================

        if (modalAdicionarVendedor) {

            modalAdicionarVendedor.addEventListener(
                'click',
                function (event) {

                    if (
                        event.target ===
                        modalAdicionarVendedor
                    ) {

                        modalAdicionarVendedor.classList.remove(
                            'ativo'
                        );

                    }

                }
            );

        }


        // ==========================================
        // FECHAR SEGUNDO MODAL
        // ==========================================

        if (
            fecharCadastrarVendedor &&
            modalCadastrarVendedorCategoria
        ) {

            fecharCadastrarVendedor.addEventListener(
                'click',
                function () {

                    modalCadastrarVendedorCategoria.classList.remove(
                        'ativo'
                    );

                }
            );

        }


        // ==========================================
        // CANCELAR SEGUNDO MODAL
        // ==========================================

        if (
            cancelarCadastrarVendedor &&
            modalCadastrarVendedorCategoria
        ) {

            cancelarCadastrarVendedor.addEventListener(
                'click',
                function () {

                    modalCadastrarVendedorCategoria.classList.remove(
                        'ativo'
                    );


                    modalAdicionarVendedor.classList.add(
                        'ativo'
                    );

                }
            );

        }


        // ==========================================
        // FECHAR SEGUNDO MODAL CLICANDO FORA
        // ==========================================

        if (modalCadastrarVendedorCategoria) {

            modalCadastrarVendedorCategoria.addEventListener(
                'click',
                function (event) {

                    if (
                        event.target ===
                        modalCadastrarVendedorCategoria
                    ) {

                        modalCadastrarVendedorCategoria.classList.remove(
                            'ativo'
                        );

                    }

                }
            );

        }


        // ==========================================
// SUBMIT SEGUNDO MODAL
// ==========================================

if (formCadastrarVendedorCategoria) {

    formCadastrarVendedorCategoria.addEventListener(
        'submit',
        async function (event) {

            event.preventDefault();


            erroCadastrarVendedor.textContent =
                '';


            const usuarioId =
                vendedorSelecionadoId.value;


            const tipoId =
                categoriaSelecionadaId.value;


            const formData =
                new FormData();


            formData.append(
                'usuario_id',
                usuarioId
            );


            formData.append(
                'estrelas',
                estrelasVendedor.value
            );


            formData.append(
                'tempo_area',
                tempoAreaVendedor.value
            );


            formData.append(
                'quantidade_vendas',
                quantidadeVendasVendedor.value
            );


            formData.append(
                'whatsapp',
                telefoneVendedor.value.trim()
            );


            formData.append(
                'descricao',
                descricaoVendedor.value.trim()
            );


            if (
                fotoVendedor.files.length > 0
            ) {

                formData.append(
                    'foto',
                    fotoVendedor.files[0]
                );

            }


            try {

                const resposta =
                    await fetch(
                        `/ceo/vendedores/${tipoId}/adicionar`,
                        {
                            method: 'POST',
                            body: formData
                        }
                    );


                const resultado =
                    await resposta.json();


                console.log(
                    'RESULTADO:',
                    resultado
                );


                if (!resposta.ok) {

                    erroCadastrarVendedor.textContent =
                        resultado.erro ||
                        'Não foi possível adicionar o vendedor.';

                    return;

                }


                if (resultado.sucesso) {

                    modalCadastrarVendedorCategoria
                        .classList.remove(
                            'ativo'
                        );


                    location.reload();

                }


            } catch (erro) {

                console.error(
                    'Erro ao adicionar vendedor:',
                    erro
                );


                erroCadastrarVendedor.textContent =
                    'Erro de comunicação com o servidor.';

            }

        }
    );

    }

    }
);

