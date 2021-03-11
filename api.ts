/* eslint-disable */

type Url = {
  [key: string]: string
}
const url: Url = {
  host: '',

  // index
  topic: '/v1/topic',
  topicxxx: '/v1/topic/xxx',
  topic_add: '/api/topic/add',
  board: '/v1/board',
  topic_delete: '/api/topic/delete',
  uploads: '/uploads',

  // Admin_board
  board_add: '/api/topic/board/add',

  // register
  register: '/v1/index/register',
  token: '/v1/token',
  profile: '/v1/index/profile',
  addimg: '/v1/index/addimg',
  xxx: '/v1/index/xxx',
}

const host = 'http://127.0.0.1:5000'

for (const key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key]
  }
}

export { url }
