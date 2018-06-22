import gql from 'graphql-tag'

export const REGISTER_MUTATION = gql`
  mutation SignupMutation($name: String!, $email: String!, $password: String!) {
    createUser(
      name: $name,
      email: $email,
      password: $password
    ) {
      id
      name
      email
    }
  }
`
