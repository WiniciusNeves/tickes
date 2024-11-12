const express = require('express');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const router = express.Router();
const db = admin.firestore();

router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const ticketsSnapshot = await db.collection('tickets').get();
    const tickets = ticketsSnapshot.docs.map(doc => doc.data());
    res.json(tickets);
  } catch (error) {
    console.error("Erro ao obter tickets:", error);
    res.status(500).send(error.message);
  }
});

router.post('/createTicket', async (req, res) => {
  try {
    const { stCliente, zonaAlarme, prontoAtendimento = '' } = req.body;

    if (!stCliente || !zonaAlarme) {
      return res.status(400).send({ error: "Campos 'stCliente' e 'zonaAlarme' são obrigatórios." });
    }

    const counterRef = db.collection('counters').doc('ticketCounter');
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
      status: 'Aberto',
      stCliente,
      zonaAlarme,
      ticketNumber,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('tickets').add(newTicket);
    res.status(201).send({ ticketId: docRef.id, ...newTicket });
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    res.status(500).send(error.message);
  }
});

router.put('/updateTicket/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const ticketsRef = db.collection('tickets');
    const snapshot = await ticketsRef.where('ticketNumber', '==', parseInt(ticketNumber)).get();

    if (snapshot.empty) {
      return res.status(404).send('Ticket não encontrado');
    }

    const docRef = snapshot.docs[0].ref;
    const updatedTicket = {
      ...snapshot.docs[0].data(),
      ...req.body,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await docRef.update(updatedTicket);
    res.status(200).send(updatedTicket);
  } catch (error) {
    console.error("Erro ao atualizar ticket:", error);
    res.status(500).send(error.message);
  }
});

router.delete('/deleteTicket/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const ticketsRef = db.collection('tickets');
    const snapshot = await ticketsRef.where('ticketNumber', '==', parseInt(ticketNumber)).get();

    if (snapshot.empty) {
      return res.status(404).send('Ticket não encontrado');
    }

    const docRef = snapshot.docs[0].ref;
    await docRef.delete();
    res.status(200).send('Ticket excluído com sucesso');
  } catch (error) {
    console.error("Erro ao excluir ticket:", error);
    res.status(500).send(error.message);
  }
});

router.delete('/deleteAllTickets', async (req, res) => {
  try {
    const ticketsRef = db.collection('tickets');
    const snapshot = await ticketsRef.get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).send('Todos os tickets foram excluídos com sucesso');
  } catch (error) {
    console.error("Erro ao excluir todos os tickets:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
