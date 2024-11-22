import Toast, { BaseToast } from 'react-native-toast-message';

const customToastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: 'green' }}
            text1Style={{ fontSize: 16, fontWeight: 'bold' }}
            text2Style={{ fontSize: 14 }}
        />
    ),
    error: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: 'red' }}
            text1Style={{ fontSize: 16, fontWeight: 'bold' }}
            text2Style={{ fontSize: 14 }}
        />
    ),
};

const ToastComponent = () => {
    return <Toast config={customToastConfig} />;
};

export default ToastComponent;
