import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsMatch(
  matchedField: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        defaultMessage: () => `${propertyName} is not matching ${matchedField}`,
        validate(value: any, args: ValidationArguments) {
          const valueToMatch = args.object[matchedField];
          const isValid = value === valueToMatch;
          return isValid;
        },
      },
    });
  };
}
