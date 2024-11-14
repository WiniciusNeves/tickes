const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

const TICKET_COLLECTION = "tickets";
const COUNTER_COLLECTION = "counters";

// Função para formatar data no formato dd/mm/yyyy
/**
 * Formata uma data no formato dd/mm/yyyy.
 *
 * @param {Date} date A data a ser formatada.
 * @return {string} A data formatada no formato dd/mm/yyyy.
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

router.use(express.json());

/**
 * Obtém todos os tickets.
 *
 * @async
 * @function
 * @param {Object} req - A requisição do cliente.
 * @param {Object} res - A resposta ao cliente.
 */
router.get("/", async (req, res) => {
  try {
    const ticketsSnapshot = await db.collection(TICKET_COLLECTION).get();
    const tickets = ticketsSnapshot.docs.map((doc) => {
      const ticket = doc.data();
      return ticket;
    });
    res.json(tickets);
  } catch (error) {
    console.error("Erro ao obter tickets:", error);
    res.status(500).send(error.message);
  }
});

/**
 * Cria um novo ticket.
 *
 * @async
 * @function
 * @param {Object} req - A requisição do cliente.
 * @param {Object} res - A resposta ao cliente.
 */
router.post("/createTicket", async (req, res) => {
  try {
    const {stCliente, zonaAlarme, prontoAtendimento = "", status = "Aberto"} = req.body;
    if (!stCliente || !zonaAlarme) {
      return res.status(400).send({
        error: "Campos 'stCliente' e 'zonaAlarme' são obrigatórios.",
      });
    }

    const counterRef = db.collection(COUNTER_COLLECTION).doc("ticketCounter");

    const counterSnapshot = await counterRef.get();
    if (!counterSnapshot.exists) {
      await counterRef.set({currentNumber: 0});
    }

    const ticketNumber = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(counterRef);
      const currentNumber = doc.data().currentNumber;
      const nextTicketNumber = currentNumber + 1;

      transaction.update(counterRef, {currentNumber: nextTicketNumber});

      return nextTicketNumber;
    });

    const currentDate = new Date(); // Obter a data atual
    const formattedDate = formatDate(currentDate); // Formatar a data no formato dd/mm/yyyy

    const newTicket = {
      prontoAtendimento,
      status: status || "Aberto",
      stCliente,
      zonaAlarme,
      ticketNumber,
      createdAt: formattedDate, // Data formatada manualmente
      updatedAt: formattedDate, // Data formatada manualmente
    };

    const docRef = await db.collection(TICKET_COLLECTION).add(newTicket);
    res.status(201).send({ticketId: docRef.id, ...newTicket});
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    res.status(500).send(error.message);
  }
});

/**
 * Atualiza um ticket existente.
 *
 * @async
 * @function
 * @param {Object} req - A requisição do cliente.
 * @param {Object} res - A resposta ao cliente.
 */
router.put("/updateTicket/:ticketNumber", async (req, res) => {
  try {
    const ticketNumber = parseInt(req.params.ticketNumber, 10);
    if (isNaN(ticketNumber)) {
      return res.status(400).send("Número do ticket inválido");
    }

    const ticketsRef = db.collection(TICKET_COLLECTION);
    const snapshot = await ticketsRef.where("ticketNumber", "==", ticketNumber).get();

    if (snapshot.empty) {
      return res.status(404).send("Ticket não encontrado");
    }

    const updatedTicket = {
      ...snapshot.docs[0].data(),
      ...req.body,
      updatedAt: formatDate(new Date()), // Atualiza a data de atualização
    };

    await snapshot.docs[0].ref.update(updatedTicket);
    res.status(200).send(updatedTicket);
  } catch (error) {
    console.error("Erro ao atualizar ticket:", error);
    res.status(500).send(error.message);
  }
});

/**
 * Exclui um ticket existente.
 *
 * @async
 * @function
 * @param {Object} req - A requisição do cliente.
 * @param {Object} res - A resposta ao cliente.
 */
router.delete("/deleteTicket/:ticketNumber", async (req, res) => {
  try {
    const ticketNumber = parseInt(req.params.ticketNumber, 10);
    if (isNaN(ticketNumber)) {
      return res.status(400).send("Número do ticket inválido");
    }

    const ticketsRef = db.collection(TICKET_COLLECTION);
    const snapshot = await ticketsRef.where("ticketNumber", "==", ticketNumber).get();

    if (snapshot.empty) {
      return res.status(404).send("Ticket não encontrado");
    }

    await snapshot.docs[0].ref.delete();
    res.status(200).send("Ticket excluído com sucesso");
  } catch (error) {
    console.error("Erro ao excluir ticket:", error);
    res.status(500).send(error.message);
  }
});

/**
 * Exclui todos os tickets (requisição restrita a administradores).
 *
 * @async
 * @function
 * @param {Object} req - A requisição do cliente.
 * @param {Object} res - A resposta ao cliente.
 */
router.delete("/deleteAllTickets", async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).send("Ação não permitida");
    }

    const ticketsRef = db.collection(TICKET_COLLECTION);
    const snapshot = await ticketsRef.get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    res.status(200).send("Todos os tickets foram excluídos com sucesso");
  } catch (error) {
    console.error("Erro ao excluir todos os tickets:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
