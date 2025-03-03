import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, ScrollView, Dimensions, Alert, Platform, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import styles from "./styles";
import { fetchTicketsByMonth, fetchDashboardSummary } from "../../../api/ticketsService";

const screenWidth = Dimensions.get("window").width;

interface TopClient {
    client: string;
    count: number;
}

interface TopZone {
    zone: string;
    count: number;
}

interface Ticket {
    ticketNumber: string;
    createdAt: { _seconds: number } | Date | string;
    status: string;
    stCliente: string;
    zonaAlarme: string;
    prontoAtendimento: string;
    name: string;
}

interface TicketCreator {
    name: string;
    count: number;
}

interface DashboardData {
    totalTickets: number;
    top10Clients: TopClient[];
    tickets: Ticket[];
    top3Zones: TopZone[];
    ticketCreatorsCount: TicketCreator[];
}

export default function Dashboard() {
    const [month, setMonth] = useState("1");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DashboardData>({
        totalTickets: 0,
        top10Clients: [],
        tickets: [],
        top3Zones: [],
        ticketCreatorsCount: [],
    });
    const [error, setError] = useState<string | null>(null);
    const [showTableOnly, setShowTableOnly] = useState(false);

    const fetchData = async () => {
        if (!month || !year) return;
        setLoading(true);
        setError(null);

        try {
            const response = showTableOnly
                ? await fetchTicketsByMonth(month, year)
                : await fetchDashboardSummary(month, year);

            const tickets = response.tickets ? response.tickets.map((ticket: any) => ({
                ...ticket,
                createdAt: ticket.createdAt && typeof ticket.createdAt._seconds === "number"
                    ? new Date(ticket.createdAt._seconds * 1000)
                    : new Date(ticket.createdAt),
                updatedAt: ticket.updatedAt && typeof ticket.updatedAt._seconds === "number"
                    ? new Date(ticket.updatedAt._seconds * 1000)
                    : new Date(ticket.updatedAt),
            })) : [];

            const top10Clients = response.top10Clients ? response.top10Clients.map((client: any) => ({
                client: client[0],
                count: client[1],
            })) : [];

            const top3Zones = response.top3Zones ? response.top3Zones.map((zone: any) => ({
                zone: zone[0],
                count: zone[1],
            })) : [];

            const ticketCreatorsCount = response.top5TicketCreators
                ? response.top5TicketCreators.map((creator: any) => ({
                    name: creator[0] && creator[0] !== "undefined" ? creator[0] : "Não identificado",
                    count: creator[1],
                }))
                : [];


            setData({
                totalTickets: response.totalTickets || 0,
                top10Clients: top10Clients,
                tickets: tickets,
                top3Zones: top3Zones,
                ticketCreatorsCount: ticketCreatorsCount,
            });
        } catch (err) {
            console.error("Erro ao carregar os dados:", err);
            setError("Erro ao carregar os dados. Tente novamente.");
            setData({ totalTickets: 0, top10Clients: [], tickets: [], top3Zones: [], ticketCreatorsCount: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [month, year, showTableOnly]);

    const checkPermissions = async () => {
        if (Platform.OS === "android") {
            if (Platform.Version >= 30) {
                return true;
            } else {
                const result = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                if (result !== RESULTS.GRANTED) {
                    Alert.alert("Permissão Negada", "É necessário permitir o acesso ao armazenamento.");
                    return false;
                }
            }
        }
        return true;
    };

    const formatTimestamp = (timestamp: { _seconds: number } | Date | string | null) => {
        if (!timestamp) return "Data inválida";
        let date;
        if (typeof timestamp === "string") {
            date = new Date(timestamp);
        } else if (timestamp instanceof Date) {
            date = timestamp;
        } else {
            date = new Date(timestamp._seconds * 1000);
        }
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const exportToCSV = async (tickets: Ticket[]) => {
        if (!tickets || tickets.length === 0) {
            Alert.alert("Erro", "Nenhum dado disponível para exportação.");
            return;
        }

        try {
            const hasPermission = await checkPermissions();
            if (!hasPermission) return;

            const headers = ["Ticket", "Dia Criação", "Status", "ST Cliente", "Zona", "Pronto Atendimento", "Nome"];
            const rows = tickets.map((ticket: Ticket) => [
                ticket.ticketNumber,
                `"${formatTimestamp(ticket.createdAt)}"`,
                ticket.status,
                ticket.stCliente,
                ticket.zonaAlarme,
                ticket.prontoAtendimento,
                ticket.name,
            ]);

            const csvContent = [
                headers.join(";"),
                ...rows.map((row: any[]) => row.join(";")),
            ].join("\n");

            const path = `${RNFS.DocumentDirectoryPath}/tickets_${month}_${year}.csv`;

            await RNFS.writeFile(path, "\ufeff" + csvContent, "utf8");

            Alert.alert("Sucesso", `Arquivo salvo com sucesso em:\n${path}`);

            const options = {
                url: `file://${path}`,
                type: "text/csv",
                failOnCancel: false,
                message: "Confira o arquivo CSV exportado.",
            };

            await Share.open(options);

        } catch (error) {
            console.error("Erro ao salvar o arquivo:", error);
            Alert.alert("Erro ao salvar o arquivo", "Não foi possível salvar o CSV.");
        }
    };

    const renderDashboard = () => (
        <ScrollView contentContainerStyle={styles.dashboardContainer}>
            <View style={styles.summary}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Total de Tickets</Text>
                    <Text style={styles.cardValue}>{data.totalTickets}</Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Top 10 Clientes</Text>
                {data.top10Clients.length > 0 ? (
                    <PieChart
                        data={data.top10Clients.map((client, index) => ({
                            name: client.client,
                            population: isNaN(client.count) ? 0 : client.count,
                            color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#E7E9ED", "#76D7C4", "#F7DC6F", "#CD6155"][index % 10],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15,
                        }))}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        absolute
                    />
                ) : (
                    <Text style={{ textAlign: "center" }}>Sem dados para o gráfico.</Text>
                )}
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Top 3 Zonas</Text>
                {data.top3Zones.length > 0 ? (
                    <BarChart
                        data={{
                            labels: data.top3Zones.map(zone => zone.zone),
                            datasets: [
                                {
                                    data: data.top3Zones.map(zone => zone.count),
                                },
                            ],
                        }}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        verticalLabelRotation={30}
                    />
                ) : (
                    <Text style={{ textAlign: "center" }}>Sem dados para o gráfico</Text>
                )}
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Top 5 Nomes de Criadores de Tickets</Text>
                {data.ticketCreatorsCount.length > 0 ? (
                    <LineChart
                        data={{
                            labels: data.ticketCreatorsCount.map(creator => creator.name),
                            datasets: [
                                {
                                    data: data.ticketCreatorsCount.map(creator => creator.count),
                                },
                            ],
                        }}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        bezier
                    />
                ) : (
                    <Text style={{ textAlign: "center" }}>Dados de Pronto Atendimento ainda não recebidos.</Text>
                )}
            </View>
        </ScrollView>
    );

    const renderTable = () => (
        <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
            {/* Conteúdo da tabela */}
        </ScrollView>
    );

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.title}>Dashboard</Text>

            <View style={styles.summary}>
                <Picker
                    selectedValue={month}
                    onValueChange={(value) => setMonth(value)}
                    style={{ flex: 1, color: "#333333" }}
                    dropdownIconColor="#333333"
                >
                    {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
                        .map((monthName, index) => (
                            <Picker.Item key={index} label={monthName} value={(index + 1).toString()} style={{ color: "#fff" }} />
                        ))}
                </Picker>

                <Picker
                    selectedValue={year}
                    onValueChange={(value) => setYear(value)}
                    style={{ flex: 1, color: "#333333" }}
                    dropdownIconColor="#333333"
                >
                    {[...Array(5).keys()].map((i) => {
                        const yearOption = (new Date().getFullYear() - i).toString();
                        return <Picker.Item key={i} label={yearOption} value={yearOption} style={{ color: "#fff" }} />;
                    })}
                </Picker>
            </View>

            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowTableOnly(!showTableOnly)}
            >
                <Text style={styles.toggleButtonText}>
                    {showTableOnly ? "Mostrar Dashboard" : "Mostrar Lista"}
                </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                {loading && <ActivityIndicator size="large" color="#0000ff" />}
                {error && <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>}
                {data && (showTableOnly ? renderTable() : renderDashboard())}
            </View>

            {showTableOnly && (
                <View style={{ marginTop: 20, borderRadius: 5, width: "50%", position: "relative", alignSelf: "center" }}>
                    <Button title="Exportar CSV" onPress={() => exportToCSV(data.tickets)} />
                </View>
            )}
        </View>
    );
}