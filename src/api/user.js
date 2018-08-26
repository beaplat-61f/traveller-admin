import gql from 'graphql-tag'

export const USER_PAGE_QUERY = gql`
  query QueryUsersPage($page: Int, $page_size: Int, $nickname: String) {
    userPage(page: $page, page_size: $page_size, nickname: $nickname) {
      users {
        id
        nickname
        avatar
      }
      total
    }
  }
`

export const USER_QUERY = gql`
  query QueryUsersPage($page: Int, $page_size: Int, $nickname: String) {
    userPage(page: $page, page_size: $page_size, nickname: $nickname) {
      row {
        id
        nickname
        account
      }
      total
    }
  }
`
