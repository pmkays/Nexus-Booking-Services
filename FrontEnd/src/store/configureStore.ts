import { configureStore as configureStoreProd } from './configureStore.prod';
import { configureStore as configureStoreDev } from './configureStore.dev';

const configureStore =  process.env.NODE_ENV === 'prod' ? configureStoreProd : configureStoreDev;

export { configureStore };
