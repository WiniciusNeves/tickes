import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        margin: 20,
        textAlign: "center",
        
    },
    loadingText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 50,
        
    },
    summary: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        backgroundColor: "#fff",
        color: "#000",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    card: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flex: 1,
        marginHorizontal: 5,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#555",
        marginBottom: 5,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    chartContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        padding: 10,
    }
});

export default styles;
