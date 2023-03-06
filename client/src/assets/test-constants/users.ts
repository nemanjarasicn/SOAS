import {User} from "../../app/interfaces/user-item";

/**
 * user constants for unit tests
 */
export class UserTestConstants {

  public static USER = {
    USER_SOAS_NAME: 'Max Mustermann',
    USER_SOAS_LOGIN: 'MM',
    USER_SOAS_PASSWD: 'test',
    USER_LANGUAGE: 'DE_DE',
    USER_ROLE: 'user',
  };

  public static USER_WITH_ID = {
    USER_SOAS_ID: 1,
    USER_SOAS_NAME: 'Max Mustermann',
    USER_SOAS_LOGIN: 'MM',
    USER_SOAS_PASSWD: 'test',
    USER_ROLE: 'DE_DE',
    USER_LANGUAGE:'user',
  };

}
