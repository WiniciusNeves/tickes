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
const months = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// Rota para obter tickets por mês
router.get("/byMonth", async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).send("Ano e mês são obrigatórios");
    }

    const parsedYear = parseInt(year, 10);
    let parsedMonth = parseInt(month, 10);

    // Se o mês for uma string (ex: "dezembro"), converta para número
    if (isNaN(parsedMonth)) {
      parsedMonth = months.indexOf(month.toLowerCase()) + 1; // Converte mês para número
    }

    if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).send("Ano e mês devem ser números válidos");
    }

    const ticketsSnapshot = await db.collection(TICKET_COLLECTION).get();
    const tickets = ticketsSnapshot.docs
      .map((doc) => doc.data())
      .filter((ticket) => {
        const createdAt = ticket.createdAt.toDate();
        return createdAt.getFullYear() === parsedYear && (createdAt.getMonth() + 1) === parsedMonth;
      });

    res.json({
      year: parsedYear,
      month: months[parsedMonth - 1],
      tickets,
    });
  } catch (error) {
    console.error("Erro ao obter tickets por mês:", error);
    res.status(500).send(error.message);
  }
});

// Rota para resumo do dashboard
router.get("/dashboardSummary", async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).send("Os parâmetros 'month' e 'year' são obrigatórios.");
    }

    let parsedMonth = parseInt(month, 10);

    if (isNaN(parsedMonth)) {
      parsedMonth = months.indexOf(month.toLowerCase()) + 1; // Converte mês para número
    }

    const parsedYear = parseInt(year, 10);

    if (isNaN(parsedYear) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).send("Mês ou ano inválidos.");
    }

    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 0, 23, 59, 59);

    const ticketsRef = db.collection(TICKET_COLLECTION);
    const snapshot = await ticketsRef
      .where("createdAt", ">=", startDate)
      .where("createdAt", "<=", endDate)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Nenhum ticket encontrado para o mês especificado.");
    }

    const tickets = snapshot.docs.map((doc) => doc.data());

    // Calcula o número total de tickets no mês
    const totalTickets = tickets.length;

    // Top 10 clientes (stCliente) com mais tickets
    const topClients = {};
    tickets.forEach((ticket) => {
      topClients[ticket.stCliente] = (topClients[ticket.stCliente] || 0) + 1;
    });
    const top10Clients = Object.entries(topClients)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Top 3 zonas com mais alarmes
    const topZones = {};
    tickets.forEach((ticket) => {
      topZones[ticket.zonaAlarme] = (topZones[ticket.zonaAlarme] || 0) + 1;
    });
    const top3Zones = Object.entries(topZones)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    res.status(200).json({
      totalTickets,
      top10Clients,
      top3Zones,
      tickets,
    });

  } catch (error) {
    console.error("Erro ao gerar resumo para o Dashboard:", error);
    res.status(500).send(error.message);
  }
});


router.post("/createTicket", async (req, res) => {
  try {
    const { stCliente, zonaAlarme, prontoAtendimento = "", name, status = "Aberto" } = req.body;

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
      name,
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
