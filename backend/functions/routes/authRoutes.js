
const express = require("express");
const admin = require("firebase-admin");

const router = new express.Router();

router.use(express.json());

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

router.post("/login", async (req, res) => {
  try {
    const {email, password, role} = req.body;

    if (!email || !password) {
      return res.status(400).send("Campos 'email' e 'password' obrigatórios.");
    }

    const userSnapshot = await admin.auth().getUserByEmail(email);

    if (!userSnapshot) {
      return res.status(404).send("Usuário não encontrado.");
    }

    const user = userSnapshot.toJSON();

    if (user.disabled) {
      return res.status(401).send("Usuário desabilitado.");
    }

    if (user.password !== password) {
      return res.status(401).send("Senha incorreta.");
    }

    if (user.role !== role) {
      return res.status(403).send("Acesso negado.");
    }

    const token = admin.auth().createCustomToken(user.uid);

    res.status(200).send({token});
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).send(error.message);
  }
});

router.post("/register", async (req, res) => {
  try {
    const {email, password, role} = req.body;

    if (!email || !password) {
      return res.status(400).send("Campos 'email' e 'password' obrigatórios.");
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      role: role || "user",
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role,
    });

    res.status(201).send("Usuário criado com sucesso.");
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).send(error.message);
  }
});

router.post("/disableUser", async (req, res) => {
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).send("Campo 'email' obrigatório.");
    }

    const userSnapshot = await admin.auth().getUserByEmail(email);

    if (!userSnapshot) {
      return res.status(404).send("Usuário nao encontrado.");
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


module.exports = router;
