import gql from 'graphql-tag'
import request from '@/utils/request'

export const ARTICLE_PAGE_QUERY = gql`
  query QueryArticlesPage($page: Int, $page_size: Int, $nickname: String) {
    articlePage(page: $page, page_size: $page_size, nickname: $nickname) {
      row {
        id
        surface
        content
        traveller_user_nickname
        traveller_location_name
        created_at
        updated_at
      }
      total
    }
  }
`

export const CREATE_ARTICLE_MUTATION = gql`
  mutation ($traveller_user_account: String, $traveller_location_name: String, $surface: String, $content: String, $published_at: String) {
    createArticle(traveller_user_account: $traveller_user_account, traveller_location_name: $traveller_location_name, surface: $surface, content: $content, published_at: $published_at) {
      id
      traveller_user_account
      traveller_location_name
      surface
      content
      created_at
      updated_at
    }
  }
`

export function selectPreArticle(params) {
  return request({
    url: '/pre-article',
    params
  })
}
export function singlePreArticle(id) {
  return request({
    url: `/pre-article/${id}`
  })
}
export function createPreArticle(data) {
  return request({
    url: '/pre-article',
    method: 'POST',
    data
  })
}
export function updatePreArticle(data) {
  return request({
    url: `/pre-article/${data.id}`,
    method: 'PUT',
    data
  })
}
export function deletePreArticle(id) {
  return request({
    url: `/pre-article/${id}`,
    method: 'DELETE'
  })
}
