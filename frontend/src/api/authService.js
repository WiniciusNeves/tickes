import auth from '@react-native-firebase/auth';

/**
 * Realiza o login do usuário.
 * @param {string} email E-mail do usuário.
 * @param {string} password Senha do usuário.
 * @returns {Promise<Object>} Dados do usuário logado.
 */
export const login = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

/**
 * Cria um novo usuário.
 * @param {string} email E-mail do usuário.
 * @param {string} password Senha do usuário.
 * @returns {Promise<Object>} Dados do usuário criado.
 */
export const register = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

/**
 * Desabilita o usuário (logout).
 * @returns {Promise<void>} Confirmação do logout.
 */
export const disableUser = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error('Erro ao deslogar:', error);
    throw error;
  }
};
