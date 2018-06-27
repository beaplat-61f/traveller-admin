import gql from 'graphql-tag'

export const ARTICLE_PAGE_QUERY = gql`
  query QueryArticlesPage($page: Int, $page_size: Int, $nickname: String) {
    articlePage(page: $page, page_size: $page_size, nickname: $nickname) {
      articles {
        id
        content
        traveller_user_nickname
        traveller_location_name
      }
      total
    }
  }
`
