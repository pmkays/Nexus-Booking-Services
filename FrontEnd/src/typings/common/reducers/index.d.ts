
/**
 * Base API Object
 *
 * @interface BaseObject
 */
export interface BaseObject {
  isError:   boolean;
  error?:    ErrorObject;
  status:    number;
}

/**
 * Error Object
 * 
 * @interface ErrorObject
 */
export interface ErrorObject {
  code:    string;
  message: string;
}

/**
 * Auth Object
 *
 * @interface AuthObject
 */
export interface AuthObject extends BaseObject {
  token?: string;
}

/**
 * User Object
 * 
 * @interface UserObject
 */
export interface UserObject extends BaseObject {
  items?: UserItemsObject[];
}

export interface UserItemsObject {
  id:           string;
  email:        string;
  firstName:    string;
  lastName:     string;
  phoneNo:      string;
  address:      string;
}
