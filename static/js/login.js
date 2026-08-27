document.addEventListener(
    'DOMContentLoaded',
    function () {

        // ==========================================
        // MOSTRAR / OCULTAR SENHA
        // ==========================================

        const senha =
            document.getElementById(
                'senha'
            );

        const mostrarSenha =
            document.getElementById(
                'mostrarSenha'
            );


        if (
            senha &&
            mostrarSenha
        ) {

            mostrarSenha.addEventListener(
                'click',
                function () {

                    if (
                        senha.type === 'password'
                    ) {

                        senha.type =
                            'text';

                        mostrarSenha.textContent =
                            'Ocultar';

                    } else {

                        senha.type =
                            'password';

                        mostrarSenha.textContent =
                            'Mostrar';

                    }

                }
            );

        }


        // ==========================================
        // ELEMENTOS - ESQUECI SENHA
        // ==========================================

        const btnEsqueciSenha =
            document.getElementById(
                'btnEsqueciSenha'
            );

        const modalEsqueciSenha =
            document.getElementById(
                'modalEsqueciSenha'
            );

        const fecharModalEsqueciSenha =
            document.getElementById(
                'fecharModalEsqueciSenha'
            );

        const emailEsqueciSenha =
            document.getElementById(
                'emailEsqueciSenha'
            );

        const btnEnviarCodigo =
            document.getElementById(
                'btnEnviarCodigo'
            );

        const erroEsqueciSenha =
            document.getElementById(
                'erroEsqueciSenha'
            );


        // ==========================================
        // ABRIR MODAL
        // ==========================================

        if (
            btnEsqueciSenha &&
            modalEsqueciSenha
        ) {

            btnEsqueciSenha.addEventListener(
                'click',
                function (event) {

                    event.preventDefault();


                    modalEsqueciSenha.classList.add(
                        'ativo'
                    );


                    if (
                        erroEsqueciSenha
                    ) {

                        erroEsqueciSenha.textContent =
                            '';

                    }


                    if (
                        emailEsqueciSenha
                    ) {

                        emailEsqueciSenha.value =
                            '';

                        emailEsqueciSenha.focus();

                    }


                    if (
                        btnEnviarCodigo
                    ) {

                        btnEnviarCodigo.disabled =
                            false;

                        btnEnviarCodigo.textContent =
                            'Enviar código';

                    }

                }
            );

        }


        // ==========================================
        // FECHAR MODAL NO X
        // ==========================================

        if (
            fecharModalEsqueciSenha &&
            modalEsqueciSenha
        ) {

            fecharModalEsqueciSenha.addEventListener(
                'click',
                function () {

                    modalEsqueciSenha.classList.remove(
                        'ativo'
                    );

                }
            );

        }


        // ==========================================
        // FECHAR MODAL CLICANDO FORA
        // ==========================================

        if (
            modalEsqueciSenha
        ) {

            modalEsqueciSenha.addEventListener(
                'click',
                function (event) {

                    if (
                        event.target ===
                        modalEsqueciSenha
                    ) {

                        modalEsqueciSenha.classList.remove(
                            'ativo'
                        );

                    }

                }
            );

        }


        // ==========================================
        // ENVIAR CÓDIGO
        // ==========================================

        if (
            btnEnviarCodigo &&
            emailEsqueciSenha &&
            erroEsqueciSenha
        ) {

            btnEnviarCodigo.addEventListener(
                'click',
                async function () {

                    // Evita clique repetido
                    if (
                        btnEnviarCodigo.disabled
                    ) {

                        return;

                    }


                    const email =
                        emailEsqueciSenha.value
                            .trim();


                    erroEsqueciSenha.textContent =
                        '';


                    // ==================================
                    // VALIDAR EMAIL
                    // ==================================

                    if (
                        !email
                    ) {

                        erroEsqueciSenha.textContent =
                            'Digite seu e-mail.';

                        emailEsqueciSenha.focus();

                        return;

                    }


                    // ==================================
                    // BLOQUEAR BOTÃO
                    // ==================================

                    btnEnviarCodigo.disabled =
                        true;

                    btnEnviarCodigo.textContent =
                        'Enviando...';


                    try {

                        // ==================================
                        // POST PARA O FLASK
                        // ==================================

                        const resposta =
                            await fetch(
                                '/esqueci-senha/enviar-codigo',
                                {

                                    method:
                                        'POST',

                                    headers: {

                                        'Content-Type':
                                            'application/json'

                                    },

                                    body:
                                        JSON.stringify(
                                            {
                                                email:
                                                    email
                                            }
                                        )

                                }
                            );


                        const resultado =
                            await resposta.json();


                        // ==================================
                        // ERRO DO BACKEND
                        // ==================================

                        if (
                            !resposta.ok
                        ) {

                            erroEsqueciSenha.textContent =
                                resultado.erro ||
                                'Não foi possível enviar o código.';


                            btnEnviarCodigo.disabled =
                                false;


                            btnEnviarCodigo.textContent =
                                'Enviar código';


                            return;

                        }


                        // ==================================
                        // SUCESSO
                        // ==================================

                        btnEnviarCodigo.textContent =
                            'Código enviado';


                        // ==================================
                        // IR PARA TELA DE CÓDIGO
                        // ==================================

                        window.location.href =
                            '/esqueci-senha/verificar-codigo';


                    } catch (
                        erro
                    ) {

                        console.error(
                            'Erro ao enviar código:',
                            erro
                        );


                        erroEsqueciSenha.textContent =
                            'Erro de comunicação com o servidor.';


                        // Libera para nova tentativa
                        btnEnviarCodigo.disabled =
                            false;


                        btnEnviarCodigo.textContent =
                            'Enviar código';

                    }

                }
            );

        }

    }
);