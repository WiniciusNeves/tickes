const express = require("express");
const admin = require("firebase-admin");

const router = new express.Router();

router.use(express.json());

// Rota para listar todos os usuários
router.get("/", async (req, res) => {
  try {
    const usersSnapshot = await admin.auth().listUsers();
    const users = usersSnapshot.users.map((user) => user.toJSON());
    res.json(users);
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    res.status(500).send(error.message);
  }
});

// Rota para login - **Esta parte deve ser feita no cliente, não no backend**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Campos 'email' e 'password' obrigatórios.");
    }

    // Autenticação deve ser feita no cliente usando Firebase SDK
    // Utilize o Firebase Authentication SDK para realizar login no frontend.

    res.status(401).send("Autenticação no backend não é recomendada. Use o Firebase SDK no cliente.");
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).send(error.message);
  }
});

// Rota para atualizar informações do usuário
router.put("/updateUser", async (req, res) => {
  try {
    // Pegar o UID da URL (query)
    const { uid } = req.query;
    const { email, password, role } = req.body;

    if (!uid) {
      return res.status(400).send("Campo 'uid' obrigatório.");
    }

    // Atualizar informações do usuário
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (role) {
      updates.customClaims = { role }; // Definir a role como claim personalizada
    }

    await admin.auth().updateUser(uid, updates);

    // Atualizar role se houver
    if (role) {
      await admin.auth().setCustomUserClaims(uid, { role });
    }

    res.status(200).send("Usuário atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).send(error.message);
  }
});
// Rota para registrar um novo usuário
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).send("Campos 'email' e 'password' obrigatórios.");
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Adiciona claims personalizadas para o usuário
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: role || "user", // Define 'role' como 'user' por padrão
    });

    res.status(201).send("Usuário criado com sucesso.");
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).send(error.message);
  }
});

// Rota para desabilitar um usuário
router.post("/disableUser", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Campo 'email' obrigatório.");
    }

    const userSnapshot = await admin.auth().getUserByEmail(email);

    if (!userSnapshot) {
      return res.status(404).send("Usuário não encontrado.");
    }

    await admin.auth().updateUser(userSnapshot.uid, {
      disabled: true,
    });

    res.status(200).send("Usuário desabilitado com sucesso.");
  } catch (error) {
    console.error("Erro ao desabilitar usuário:", error);
    res.status(500).send(error.message);
  }
});

// Rota para realizar logout do usuário (revoga token)
router.post("/logout", async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(400).send("Token de usuário necessário.");
    }

    await admin.auth().revokeRefreshTokens(token);
    res.status(200).send("Logout realizado com sucesso.");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
