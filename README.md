## Description

[Nest](https://github.com/nestjs/nest) Owais Capital assessment.

## Running the app

```bash
# development
$ sudo docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Features

- [Stripe](https://stripe.com/docs/api/checkout/sessions)
- [Swagger documentation](https://docs.nestjs.com/openapi/introduction)

## API core

- /auth
  - signin: simple login with username and password.
  - signup: basic form to signup.

- /users (note: all these functions works only for admin user)
  - GET /: read all users paginated with dynamic query object.
  - Post /: create a user.
  - Patch /id: update a user.

- /accounts
  - GET /: read all accounts paginated with dynamic query object if admin or logged in user's accounts.
  - Post /: create a account and make it not active till amin active it.
  - Patch /accountNumber : update account active status.

- /transactions
  - Post /card-deposit: get stripe session to deposit via card.
  - Post /deposit: admin can make a simple deposit transaction via account number.
  - Post /withdraw: admin can make a simple withdraw transaction via account number.
  - Post /transfer: user can make a transfer transaction from his accounts to any other accounts.
  - Get /accountNumber: read all logged in user transactions but admin can see any transactions.


## License

Nest is [MIT licensed](LICENSE).
