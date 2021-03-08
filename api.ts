/* eslint-disable */

type Url = {
  [key: string]: string
}
const url: Url = {
  host: '',

  // index
  topic: '/api/topic',
  topic_add: '/api/topic/add',
  board: '/api/topic/board',
  topic_delete: '/api/topic/delete',
  uploads: '/uploads',

  // Admin_board
  board_add: '/api/topic/board/add',

  // register
  register: '/v1/index/register',
  login: '/v1/index/login',
}

const host = 'http://127.0.0.1:5000'

for (const key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key]
  }
}

export { url }
