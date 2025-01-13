import React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "./styles";

interface TableProps {
    headers: string[];
    rows: (string | number)[][];
}

const Table: React.FC<TableProps> = ({ headers, rows }) => {
    return (
        <View style={styles.tableContainer}>
            {/* Cabeçalho da Tabela */}
            <View style={styles.tableHeader}>
                {headers.map((header, index) => (
                    <Text key={index} style={styles.tableHeaderCell}>
                        {header}
                    </Text>
                ))}
            </View>

            {/* Linhas da Tabela */}
            <ScrollView style={styles.tableBody} contentContainerStyle={{ flexGrow: 1 }}>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                        {row.map((cell, cellIndex) => (
                            <Text key={cellIndex} style={styles.tableCell}>
                                {cell}
                            </Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default Table;
