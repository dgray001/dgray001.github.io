import {CufFormField} from "../components/common/form/form_field/form_field";

/** Class allowing input data to be validated */
export class Validator {
  type: string;

  constructor(type: string, data?: string) {
    this.type = type;
  }

  validate<T>(input: string, el: CufFormField<any, T>): string|undefined {
    switch(this.type) {
      case 'required':
        if (!input) {
          return 'This field is required';
        }
        break;
    case 'datalist':
      try {
        if (!(el as any).datalist_options.has(input)) {
          return 'Please enter one of the suggested values';
        }
      } catch(e) {
        console.error('Element with datalist validator has no datalist.');
      }
      break;
    case 'name':
      const re_name = /^[\p{L}'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,30}$/u;
      if (!re_name.test(input)) {
        return 'Please enter a valid name';
      }
      break;
    case 'address':
      const re_address = /^[\s\S]{0,60}$/;
      if (!re_address.test(input)) {
        return 'The address is too long';
      }
      break;
    case 'email':
      const re_email = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      if (!re_email.test(input) || input.length > 320) {
        return 'Please enter a valid email address';
      }
      break;
    case 'money':
      const re_money = /^\$?[0-9]+(\.[0-9][0-9])?$/;
      if (!re_money.test(input)) {
        return 'Please enter a valid dollar amount';
      }
      break;
    case 'suffix':
      const re_suffix = /^$|^[\p{L}0-9'\-,.][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,8}$/u;
      if (!re_suffix.test(input)) {
        return 'Please enter a valid suffix';
      }
      break;
    case 'number':
      if (isNaN(parseFloat(input))) {
        return 'Please enter a valid number';
      }
      break;
    case 'integer':
      const valid_integer = !isNaN(parseInt(input)) && /^[-]?\+?\d+$/.test(input);
      if (!valid_integer) {
        return 'Please enter a valid integer';
      }
      break;
    case 'password':
      if (input.length < 6) {
        return 'Please choose a longer password'
      }
      const re_password = /^\S*$/;
      if (!re_password.test(input)) {
        return 'Please omit whitespace from your password';
      }
      break;
    default:
      console.error(`Unknown validation type: ${this.type}`);
      return 'Unknown validator';
    }
    return undefined;
  }
}
