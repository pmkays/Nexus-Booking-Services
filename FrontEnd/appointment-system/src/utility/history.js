import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export function redirect(to) {
  history.push(to);
}
