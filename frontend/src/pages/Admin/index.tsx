import React, { useState, useEffect, useMemo } from "react";
import { Text, ActivityIndicator, TouchableOpacity, Alert, View, ScrollView, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importa o hook de navegação
import {
    Container,
    InputContainer,
    DateInput,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    HeaderCell,
} from "./styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import firestore from "@react-native-firebase/firestore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

interface Ticket {
    id: string;
    ticketNumber: string;
    stCliente: string;
    zonaAlarme: string;
    prontoAtendimento: string;
    createdAt: Date;
}

export default function Admin() {
    const navigation = useNavigation(); // Inicializa o hook de navegação
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<keyof Ticket>("ticketNumber");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleStartChange = (event: any, selectedDate: Date | undefined) => {
        setShowStartPicker(false);
        if (selectedDate) setStartDate(selectedDate);
    };

    const handleEndChange = (event: any, selectedDate: Date | undefined) => {
        setShowEndPicker(false);
        if (selectedDate) setEndDate(selectedDate);
    };

    const fetchTicketsFromFirestore = async () => {
        if (startDate && endDate && startDate > endDate) {
            Alert.alert("Erro", "A data inicial não pode ser posterior à data final.");
            return;
        }

        setLoading(true);
        try {
            let query = firestore().collection("tickets");

            if (startDate) query = query.where("createdAt", ">=", firestore.Timestamp.fromDate(startDate));
            if (endDate) query = query.where("createdAt", "<=", firestore.Timestamp.fromDate(endDate));

            const querySnapshot = await query.get();

            const fetchedTickets = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(), // Converte Timestamp para Date
            }));

            setTickets(fetchedTickets as Ticket[]);
        } catch (error) {
            console.error("Erro ao buscar tickets do Firestore:", error);
            Alert.alert("Erro", "Não foi possível buscar os tickets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Carrega todos os tickets se não houver filtro de data
        if (!startDate && !endDate) {
            fetchTicketsFromFirestore(); // Carrega todos os tickets sem filtro
        }
    }, [startDate, endDate]);

    const handleSort = (column: keyof Ticket) => {
        const newDirection = sortBy === column && sortDirection === "asc" ? "desc" : "asc";
        setSortBy(column);
        setSortDirection(newDirection);
    };

    const sortedTickets = useMemo(() => {
        return [...tickets].sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];

            if (typeof valueA === "string" && typeof valueB === "string") {
                return sortDirection === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            if (valueA instanceof Date && valueB instanceof Date) {
                return sortDirection === "asc" ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
            }

            if (typeof valueA === "number" && typeof valueB === "number") {
                return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
            }

            return 0;
        });
    }, [tickets, sortBy, sortDirection]);

    const getSortArrow = () => {
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const renderTicketsTable = () => {
        if (tickets.length > 0) {
            return (
                <ScrollView>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <HeaderCell>
                                    <TouchableOpacity onPress={() => handleSort("ticketNumber")}>
                                        <Text style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>
                                            ID {sortBy === "ticketNumber" ? getSortArrow() : ""}
                                        </Text>
                                    </TouchableOpacity>
                                </HeaderCell>
                                <HeaderCell>
                                    <TouchableOpacity onPress={() => handleSort("stCliente")}>
                                        <Text style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>
                                            Cliente {sortBy === "stCliente" ? getSortArrow() : ""}
                                        </Text>
                                    </TouchableOpacity>
                                </HeaderCell>
                                <HeaderCell>
                                    <TouchableOpacity onPress={() => handleSort("zonaAlarme")}>
                                        <Text style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>
                                            Zona Alarme {sortBy === "zonaAlarme" ? getSortArrow() : ""}
                                        </Text>
                                    </TouchableOpacity>
                                </HeaderCell>
                                <HeaderCell>
                                    <TouchableOpacity onPress={() => handleSort("prontoAtendimento")}>
                                        <Text style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>
                                            Pronto Atendimento {sortBy === "prontoAtendimento" ? getSortArrow() : ""}
                                        </Text>
                                    </TouchableOpacity>
                                </HeaderCell>
                            </TableRow>
                        </TableHeader>

                        {sortedTickets.map((ticket, index) => (
                            <TableRow key={index}>
                                <TableCell>{ticket.ticketNumber}</TableCell>
                                <TableCell>{ticket.stCliente || "N/A"}</TableCell>
                                <TableCell>{ticket.zonaAlarme || "N/A"}</TableCell>
                                <TableCell>{ticket.prontoAtendimento || "N/A"}</TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </ScrollView>
            );
        } else {
            return (
                <Text style={{ textAlign: "center", color: "#888", marginVertical: 20 }}>
                    Nenhum ticket encontrado para o intervalo selecionado.
                </Text>
            );
        }
    };

    const screenHeight = Dimensions.get("window").height;

    return (
        <Container>
            <InputContainer>
                <Text>Data Inicial</Text>
                <DateInput
                    onPress={() => setShowStartPicker(true)}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 10,
                    }}
                >
                    <Text>{startDate ? formatDate(startDate) : "Selecionar"}</Text>
                    <MaterialIcons name="calendar-today" size={20} color="#333" />
                </DateInput>
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleStartChange}
                    />
                )}
            </InputContainer>

            <InputContainer>
                <Text>Data Final</Text>
                <DateInput
                    onPress={() => setShowEndPicker(true)}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 10,
                    }}
                >
                    <Text>{endDate ? formatDate(endDate) : "Selecionar"}</Text>
                    <MaterialIcons name="calendar-today" size={20} color="#333" />
                </DateInput>
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleEndChange}
                    />
                )}
            </InputContainer>

            <Text style={{ marginVertical: 10 }}>
                Mostrando tickets de {startDate ? formatDate(startDate) : "início"} até {endDate ? formatDate(endDate) : "hoje"}
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <View style={{ height: screenHeight * 0.4 }}>
                    {renderTicketsTable()}
                </View>
            )}

            <TouchableOpacity
                onPress={() => (navigation.navigate as any)("Home")} // Navegação corrigida
                style={{ marginTop: 20, padding: 10, backgroundColor: "#002C0B", borderRadius: 5 }}
            >
                <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>Voltar para Home</Text>
            </TouchableOpacity>
        </Container>
    );
}
