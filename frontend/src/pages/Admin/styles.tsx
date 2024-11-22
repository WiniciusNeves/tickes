import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin: 10px;
  padding: 20px;
  border-radius: 12px;
  background-color: #f3f3f3;
  width: 100%;
`;

export const InputContainer = styled.View`
  margin: 10px 0;
  width: 100%;
`;

export const DateInput = styled.TouchableOpacity`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin-top: 5px;
  background-color: #fff;
`;

export const Table = styled.View`
  margin-top: 20px;
  margin-right: 10px;
  width: 95%;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  background-color: #88c9a1;
  border-bottom-width: 2px;
  border-bottom-color: #5c8a72;
  width: 100%;
  height: 50px;
`;

export const TableRow = styled.View`
  flex-direction: row;
  background-color: #bde4cb;
  border-bottom-width: 1px;
  border-bottom-color: #88c9a1;
  width: 100%;
  height: 50px;
`;

export const TableCell = styled.Text`
  flex: 1;
  text-align: center;
  text-align-vertical: center;
  border-right-width: 1px;
  border-right-color: #5c8a72;
  font-size: 14px;
  color: #333;
  min-width: 60px;
  padding: 5px;
`;

export const HeaderCell = styled(TableCell)`
  font-weight: bold;
  color: #ffffff;
  background-color: #4a8c6f;
  font-size: 14px;
  white-space: nowrap;
  padding: 5px;
`;

