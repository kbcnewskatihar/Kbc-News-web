import Api from 'src/api/AxiosInterceptors'
import { GET_NEWS, SET_NEWS_VIEW } from 'src/utils/api'

export const getNewsApi = {
  getNews: requestData => {
    const {
      access_key,
      offset,
      limit,
      id,
      get_user_news,
      search, // {optional}
      language_id,
      category_id,
      subcategory_id,
      slug,
      tag_id,
      latitude,
      longitude
    } = requestData
    return Api.get(GET_NEWS, {
      params: {
        access_key,
        offset,
        limit,
        id,
        get_user_news,
        search, // {optional}
        language_id,
        category_id,
        subcategory_id,
        slug,
        tag_id,
        latitude,
        longitude
      }
    })
  },
  setNewsView: requestData => {
    const { access_key, news_id } = requestData
    return Api.post(SET_NEWS_VIEW, {
      access_key,
      news_id
    })
  }
}
