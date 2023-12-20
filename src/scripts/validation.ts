import {CufFormField} from "../components/common/form/form_field/form_field";

/** Class allowing input data to be validated */
export class Validator {
  type: string;

  constructor(type: string, data?: string) {
    this.type = type;
  }

  validate<T>(input: T, el: CufFormField<any, T>): string|undefined {
    switch(this.type) {
      case 'required':
        if (!input) {
          return 'This field is required';
        }
        break;
      default:
        console.error(`Unknown validation type: ${this.type}`);
        return 'Unknown validator';
    }
    return undefined;
  }
}

