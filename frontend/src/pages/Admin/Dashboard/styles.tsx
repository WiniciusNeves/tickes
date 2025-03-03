import { StyleSheet } from "react-native";

export default StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
    },
    summary: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 16,
        color: "#333",
    },
    cardValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    chartContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    toggleButton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10, // Adiciona margem vertical para espaçamento
        marginHorizontal: 20, // Adiciona margem horizontal para espaçamento
    },
    toggleButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});