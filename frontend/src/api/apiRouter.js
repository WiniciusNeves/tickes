import axios from 'axios';

const apiRouter = axios.create({
    baseURL: 'https://api-yo7mlyevzq-uc.a.run.app/'
});

export default apiRouter;