const botao = document.getElementById("btnUsuario");
const menu = document.getElementById("menuUsuario");

if (botao) {

    botao.addEventListener("click", function (e) {

        e.stopPropagation();
        menu.classList.toggle("active");

    });

    document.addEventListener("click", function () {

        menu.classList.remove("active");

    });

}

// ==================== PESQUISA NA PAGINA REMEDIOS ====================

const pesquisa = document.getElementById("searchInput");
const medicamentos = document.querySelectorAll(".medicamento");

if (pesquisa) {

    pesquisa.addEventListener("input", () => {

        const texto = pesquisa.value
            .toLowerCase()
            .trim();

        medicamentos.forEach(medicamento => {

            const nome = medicamento.dataset.nome.toLowerCase();

            if (nome.includes(texto)) {
                medicamento.style.display = "flex";
            } else {
                medicamento.style.display = "none";
            }

        });

    });

}