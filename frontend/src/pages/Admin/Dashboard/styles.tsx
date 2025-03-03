import { StyleSheet } from "react-native";

export default StyleSheet.create({
    dashboardContainer: {
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    summary: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    cardValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
    },
    chartContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    zoneText: {
        textAlign: "left",
        fontSize: 15,
        marginBottom: 10,
        marginLeft: 10,
        color: "#666666",
        fontWeight: "bold",
        width: "80%",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
        color: "#333",
    },
    toggleButton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
    },
    toggleButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});