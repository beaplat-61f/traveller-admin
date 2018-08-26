import gql from 'graphql-tag'

export const FEEDBACK_PAGE_QUERY = gql`
  query QueryFeedbackPage($page: Int, $page_size: Int, $content: String, $email: String) {
    feedbackPage(page: $page, page_size: $page_size, content: $content, email: $email) {
      feedback {
        id
        content
        email
        user {
          id
          nickname
        }
      }
      total
    }
  }
`
