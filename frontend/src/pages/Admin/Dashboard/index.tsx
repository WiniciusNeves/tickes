import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, ScrollView, Dimensions, Alert, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-chart-kit";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import styles from "./styles";
import Table from "../Table";
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
export default function Dashboard() {
    const [month, setMonth] = useState("1");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        totalTickets: 0,
        top10Clients: [],
        tickets: [],
        top3Zones: [],
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

            setError(null);

            setData({
                totalTickets: response.totalTickets || 0,
                top10Clients: response.top10Clients || [],
                tickets: response.tickets || [],
                top3Zones: response.top3Zones || [],
            });
        } catch (err) {
            console.error("Erro ao carregar os dados:", err);
            setError("Erro ao carregar os dados. Tente novamente.");
            setData({ totalTickets: 0, top10Clients: [], tickets: [], top3Zones: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [month, year, showTableOnly]);

    const checkPermissions = async () => {
        if (Platform.OS === "android" && Platform.Version < 29) {
            const result = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
            if (result !== RESULTS.GRANTED) {
                Alert.alert("Permissões", "Permissão de armazenamento necessária.");
                return false;
            }
        }
        return true;
    };
    const formatTimestamp = (timestamp: { _seconds: number }) => {
        const date = new Date(timestamp._seconds * 1000);
        const day = String(date.getDate()).padStart(2, "0");
        return day;
    };

    const shareFile = async (path: string) => {
        const options = {
            url: `file://${path}`,
            type: "text/csv",
            failOnCancel: false,
            message: "Confira o arquivo CSV exportado.",
        };

        try {
            await Share.open(options);
        } catch (error) {
            console.error("Erro ao compartilhar o arquivo:", error);
            Alert.alert("Erro ao compartilhar", "Houve um erro ao tentar compartilhar o arquivo.");
        }
    };

    const exportToCSV = async (tickets: any) => {
        if (!tickets || tickets.length === 0) {
            Alert.alert("Erro", "Nenhum dado disponível para exportação.");
            return;
        }

        try {
            const hasPermission = await checkPermissions();
            if (!hasPermission) return;

            const headers = ["Ticket", "Dia Criação", "Status", "ST Cliente", "Zona", "Pronto Atendimento"];
            const rows = tickets.map((ticket: any) => [
                ticket.ticketNumber,
                `"${formatTimestamp(ticket.createdAt)}"`,
                ticket.status,
                ticket.stCliente,
                ticket.zonaAlarme,
                ticket.prontoAtendimento,
            ]);

            const csvContent = [
                headers.join(";"),
                ...rows.map((row: any[]) => row.join(";")),
            ].join("\n");

            const path = `${RNFS.DownloadDirectoryPath}/tickets_${month}_${year}.csv`;

            const bom = "\ufeff";
            await RNFS.writeFile(path, bom + csvContent, "utf8");

            Alert.alert("Sucesso", `Arquivo CSV salvo em:\n${path}`);

    
            await shareFile(path);

        } catch (error) {
            console.error("Erro ao salvar o arquivo:", error);
            Alert.alert("Erro ao salvar o arquivo", "Houve um erro ao tentar salvar o arquivo CSV.");
        }
    };

    const renderDashboard = () => (
        <View>
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
                        data={data.top10Clients.map(([client, count], index) => ({
                            name: client,
                            population: count,
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
                    data.top3Zones.slice(0, 3).map(([zone, count], index) => (
                        <Text key={zone} style={{ textAlign: "left", fontSize: 15, marginBottom: 10, marginLeft: 10, color: "#666666", fontWeight: "bold", width: "80%" }}>
                            {index + 1}. Zona {zone}: {count} tickets
                        </Text>
                    ))
                ) : (
                    <Text style={{ textAlign: "center" }}>Sem dados para o gráfico</Text>
                )}
            </View>
        </View>
    );

    const renderTable = () => (
        <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
            {data.tickets.length > 0 ? (
                <Table
                    headers={["Ticket", "Dia Criação", "Status", "ST Cliente", "Zona", "Pronto Atendimento"]}
                    rows={data.tickets.map((ticket: any) => [
                        ticket.ticketNumber,
                        formatTimestamp(ticket.createdAt),
                        ticket.status,
                        ticket.stCliente,
                        ticket.zonaAlarme,
                        ticket.prontoAtendimento,
                    ])}
                />
            ) : (
                <Text style={{ textAlign: "center", padding: 20 }}>Sem tickets disponíveis.</Text>
            )}
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
                            <Picker.Item key={monthName} label={monthName} value={(index + 1).toString()} style={{ color: "#fff" }} />
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

                <Picker
                    selectedValue={showTableOnly ? "Lista" : "Dashboard"}
                    onValueChange={(value) => setShowTableOnly(value === "Lista")}
                    style={{ flex: 1, color: "#333333" }}
                    dropdownIconColor="#333333"
                >
                    <Picker.Item label="Dashboard" value="Dashboard" style={{ color: "#fff" }} />
                    <Picker.Item label="Lista" value="Lista" style={{ color: "#fff" }} />
                </Picker>
            </View>

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

