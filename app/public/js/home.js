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