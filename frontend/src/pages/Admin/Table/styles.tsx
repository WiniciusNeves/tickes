import { StyleSheet } from "react-native";

export default StyleSheet.create({
    tableContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        overflow: "hidden",
        marginVertical: 10,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f1f1f1",
        padding: 10,
    },
    tableHeaderCell: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
    },
    tableBody: {
        maxHeight: 450, 
        marginHorizontal: 10,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 8,
    },
    tableCell: {
        flex: 1,
        textAlign: "center",
    },
});
