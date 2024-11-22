const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

const TICKET_COLLECTION = "tickets";
const COUNTER_COLLECTION = "counters";

// Função para formatar data no formato dd/mm/yyyy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

router.use(express.json());

// Rota para obter todos os tickets
router.get("/", async (req, res) => {
  try {
    const ticketsSnapshot = await db.collection(TICKET_COLLECTION).get();
    const tickets = ticketsSnapshot.docs.map((doc) => {
      const ticket = doc.data();

      // Converte o Timestamp para uma string
      if (ticket.createdAt) {
        ticket.createdAt = formatDate(ticket.createdAt.toDate());
      }
      if (ticket.updatedAt) {
        ticket.updatedAt = formatDate(ticket.updatedAt.toDate());
      }

      return ticket;
    });
    res.json(tickets);
  } catch (error) {
    console.error("Erro ao obter tickets:", error);
    res.status(500).send(error.message);
  }
});

router.post("/createTicket", async (req, res) => {
  try {
    const { stCliente, zonaAlarme, prontoAtendimento = "", status = "Aberto" } = req.body;

    if (!stCliente || !zonaAlarme) {
      return res.status(400).send({
        error: "Campos 'stCliente' e 'zonaAlarme' são obrigatórios.",
      });
    }

    const counterRef = db.collection(COUNTER_COLLECTION).doc("ticketCounter");

    const counterSnapshot = await counterRef.get();
    if (!counterSnapshot.exists) {
      await counterRef.set({ currentNumber: 0 });
    }

    const ticketNumber = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(counterRef);
      const currentNumber = doc.data().currentNumber;
      const nextTicketNumber = currentNumber + 1;

      transaction.update(counterRef, { currentNumber: nextTicketNumber });

      return nextTicketNumber;
    });

    const newTicket = {
      prontoAtendimento,
      status: status || "Aberto",
      stCliente,
      zonaAlarme,
      ticketNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection(TICKET_COLLECTION).add(newTicket);
    res.status(201).send({
      ticketId: docRef.id,
      ...newTicket,
      createdAt: formatDate(newTicket.createdAt),
      updatedAt: formatDate(newTicket.updatedAt),
    });
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    res.status(500).send(error.message);
  }
});

// Exclui um ticket existente.
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

// Exclui todos os tickets (requisição restrita a administradores).
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
