import { expect, it } from 'vitest';
import { Equal, Expect } from '../helpers/type-utils';

// const makeFormValidatorFactory =
//   <Validators, TypeOfValidator extends keyof Validators>(
//     validators: Record<TypeOfValidator, (value: string) => string | undefined>,
//   ) =>
//   <Form, Field extends keyof Form>(
//     config: Record<Field, TypeOfValidator[]>,
//   ) => {
//     return (values: Record<Field, string>) => {
//       const errors = {} as Record<Field, string | undefined>;

//       for (const key in config) {
//         for (const validator of config[key]) {
//           const error = validators[validator](values[key]);
//           if (error) {
//             errors[key] = error;
//             break;
//           }
//         }
//       }

//       return errors;
//     };
//   };

// const makeFormValidatorFactory =
//   <Validators>(
//     validators: Record<keyof Validators, (value: string) => string | void>,
//   ) =>
//   <Form>(config: Record<keyof Form, Array<keyof Validators>>) => {
//     return (values: Record<keyof Form, string>) => {
//       const errors = {} as Record<keyof Form, string | undefined>;

//       for (const key in config) {
//         for (const validator of config[key]) {
//           const error = validators[validator](values[key]);
//           if (error) {
//             errors[key] = error;
//             break;
//           }
//         }
//       }

//       return errors;
//     };
//   };

const makeFormValidatorFactory =
  <Validators extends string>(
    validators: Record<Validators, (value: string) => string | void>,
  ) =>
  <Fields extends string>(config: Record<Fields, Array<Validators>>) => {
    return (values: Record<Fields, string>) => {
      const errors = {} as Record<Fields, string | undefined>;

      for (const key in config) {
        for (const validator of config[key]) {
          const error = validators[validator](values[key]);
          if (error) {
            errors[key] = error;
            break;
          }
        }
      }

      return errors;
    };
  };

const createFormValidator = makeFormValidatorFactory({
  required: (value) => {
    if (value === '') {
      return 'Required';
    }
  },
  minLength: (value) => {
    if (value.length < 5) {
      return 'Minimum length is 5';
    }
  },
  email: (value) => {
    if (!value.includes('@')) {
      return 'Invalid email';
    }
  },
});

const validateUser = createFormValidator({
  id: ['required'],
  username: ['required', 'minLength'],
  email: ['required', 'email'],
});

it('Should properly validate a user', () => {
  const errors = validateUser({
    id: '1',
    username: 'john',
    email: 'Blah',
  });

  expect(errors).toEqual({
    username: 'Minimum length is 5',
    email: 'Invalid email',
  });

  type test = Expect<
    Equal<
      typeof errors,
      {
        id: string | undefined;
        username: string | undefined;
        email: string | undefined;
      }
    >
  >;
});

it('Should not allow you to specify a validator that does not exist', () => {
  createFormValidator({
    // @ts-expect-error
    id: ['i-do-not-exist'],
  });
});

it('Should not allow you to validate an object property that does not exist', () => {
  const validator = createFormValidator({
    id: ['required'],
  });

  validator({
    // @ts-expect-error
    name: '123',
  });
});
