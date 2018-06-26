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

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(
      email: $email,
      password: $password
    ) {
      id
      name
      email
      token
    }
  }
`

export const ALL_USERS_QUERY = gql`
  query AllUsersQuery {
    allUsers {
      id
      name
      email
    }
  }
`

export const USER_QUERY = gql`
  query QueryUserById($id: String) {
    user(id: $id) {
      id
      name
      email
      articles {
        id
        title
        content
      }
    }
  }
`

export const ADD_ARTICLE_MUTATION = gql`
  mutation AddArticleMutation($title: String!, $content: String!) {
    addArticle(
      title: $title,
      content: $content
    ) {
      id
      title
      content
      user {
        id
        name
        email
      }
    }
  }
`

/* export const ALL_ARTICLES_QUERY = gql`
  query QueryArticles {
    allArticles {
      id
      title
      user {
        name
      }
    }
  }
` */

export const ALL_ARTICLES_QUERY = gql`
  query QueryArticles {
    allArticles {
      id
      content
      traveller_user_nickname
      traveller_location_name
    }
  }
`

export const ARTICLE_QUERY = gql`
  query ArticleQuery($id: String) {
    article(id: $id) {
      id
      title
      content
      user {
        name
      }
    }
  }
`
