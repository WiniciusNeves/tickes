import apiRouter from "./apiConfig";

const api = apiRouter;

// Obter todos os tickets
export const fetchTickets = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

export const fetchTicketsByMonth = async (month, year) => {
  const response = await api.get(`/tickets/byMonth`, { params: { month, year } });
  return response.data;
};

export const fetchDashboardSummary = async (month, year) => {
  const response = await api.get(`/tickets/dashboardSummary`, { params: { month, year } });
  return response.data;
};


// Criar um ticket
export const createTicket = async (data) => {
  const response = await api.post('/tickets/createTicket', data);
  return response.data;
};

// Atualizar um ticket
export const updateTicket = async (ticketNumber, data) => {
  const response = await api.put(`/tickets/updateTicket/${ticketNumber}`, data);
  return response.data;
};

// Deletar um ticket
export const deleteTicket = async (ticketNumber) => {
  const response = await api.delete(`/tickets/deleteTicket/${ticketNumber}`);
  return response.data;
};

// Deletar todos os tickets (requer admin)
export const deleteAllTickets = async () => {
  const response = await api.delete('/tickets/deleteAllTickets');
  return response.data;
};