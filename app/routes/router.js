const express = require("express");

const router = express.Router();

// Disponibiliza informações do usuário para todas as páginas
router.use((req, res, next) => {
    res.locals.logado = !!req.session.usuarioId;
    res.locals.usuario = req.session.usuarioNome || null;
    next();
});

// 🔒 MIDDLEWARE DE SEGURANÇA
function requerLogin(req, res, next) {
    if (req.session && req.session.usuarioId) {
        return next();
    }
    res.redirect("/login");
}

// ==================== ROTAS PÚBLICAS ====================

router.get("/", (req, res) => {
    res.render("pages/home", {
        remedio: null,
        cidade: "São Paulo - SP",
        farmacias: []
    });
});

router.get("/login", (req, res) => {

    if (req.session.usuarioId) {
        return res.redirect("/");
    }

    res.render("pages/login", {
        erro: null
    });

});

router.get("/cadastro", (req, res) => {

    if (req.session.usuarioId) {
        return res.redirect("/");
    }

    res.render("pages/cadastro", {
        erro: null
    });

});

router.get("/senha", (req, res) => {
    res.render("pages/senha");
});

router.get("/sobre", (req, res) => {
    res.render("pages/sobre");
});

// ==================== LOGIN USUÁRIO ====================

router.post("/login", (req, res) => {

    const { email, senha } = req.body;

    if (email && senha) {

        req.session.usuarioId = 1;
        req.session.usuarioNome = "Usuário";

        return res.redirect("/remedios");
    }

    res.render("pages/login", {
        erro: "Preencha todos os campos."
    });

});

// ==================== CADASTRO ====================

router.post("/cadastro", (req, res) => {

    const { nome, email, senha, confirmarSenha } = req.body;

    if (!nome || !email || !senha || !confirmarSenha) {
        return res.render("pages/cadastro", {
            erro: "Preencha todos os campos."
        });
    }

    if (senha !== confirmarSenha) {
        return res.render("pages/cadastro", {
            erro: "As senhas não coincidem."
        });
    }

    req.session.usuarioId = 1;
    req.session.usuarioNome = nome;

    res.redirect("/");

});

// ==================== LOGOUT ====================

router.get("/sair", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// ==================== ÁREA RESTRITA ====================

router.get("/remedios", requerLogin, (req, res) => {

    const dadosRemedios = [
        {
            id: 101,
            nome: "Dipirona Monoidratada 500mg",
            preco: "R$ 4,50",
            laboratorio: "Medley",
            farmacia: "Drogasil"
        },
        {
            id: 102,
            nome: "Ibuprofeno 600mg",
            preco: "R$ 12,90",
            laboratorio: "EMS",
            farmacia: "Drogaria São Paulo"
        },
        {
            id: 103,
            nome: "Losartana Potássica 50mg",
            preco: "R$ 8,00",
            laboratorio: "Neo Química",
            farmacia: "Ultrafarma"
        }
    ];

    res.render("pages/remedios", {
        remedios: dadosRemedios,
        usuario: req.session.usuarioNome
    });
});

router.get("/farmacias", requerLogin, (req, res) => {
    res.render("pages/farmacias", {
        usuario: req.session.usuarioNome
    });
});

router.get("/categorias", requerLogin, (req, res) => {

    const dadosCategorias = [
        "Analgésicos",
        "Antibióticos",
        "Anti-inflamatórios",
        "Cardiovasculares",
        "Vitaminas"
    ];

    res.render("pages/categorias", {
        categorias: dadosCategorias,
        usuario: req.session.usuarioNome
    });
});

// ==================== ADMIN ====================

router.post("/admin/login", (req, res) => {

    const { email, senha } = req.body;

    if (email === "admin@bioclicky.com" && senha === "123456") {
        return res.redirect("/admin");
    }

    res.send("Administrador não encontrado ou senha incorreta.");

});


router.get("/admin", (req, res) => {

    const tab = req.query.tab || "inicio";

    const dadosExemplo = {
        usuarios: [
            {
                id: 1,
                nome: "Carlos Silva",
                email: "carlos@email.com",
                tipo: "Cliente"
            },
            {
                id: 2,
                nome: "Ana Souza",
                email: "ana@farmacia.com",
                tipo: "Farmácia"
            }
        ],
        medicamentos: [
            {
                id: 101,
                nome: "Paracetamol 500mg",
                categoria: "Analgésicos",
                preco: "R$ 8,50"
            },
            {
                id: 102,
                nome: "Amoxicilina 500mg",
                categoria: "Antibióticos",
                preco: "R$ 42,00"
            }
        ],
        farmacias: [
            {
                id: 1,
                nome: "Drogasil Centro",
                cidade: "São Paulo",
                status: "Ativa"
            },
            {
                id: 2,
                nome: "Drogaria São Paulo",
                cidade: "Barueri",
                status: "Ativa"
            }
        ],
        categorias: [
            {
                id: 1,
                nome: "Analgésicos",
                total: 45
            },
            {
                id: 2,
                nome: "Antibióticos",
                total: 22
            },
            {
                id: 3,
                nome: "Vitaminas",
                total: 19
            }
        ]
    };

    res.render("pages/admin", {
        tab,
        dados: dadosExemplo
    });
});

module.exports = router;