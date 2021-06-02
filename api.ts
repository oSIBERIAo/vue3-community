/* eslint-disable */

type Url = {
  [key: string]: string
}
const url: Url = {
  host: '',

  // index
  topic: '/v1/topic',
  topicxxx: '/v1/topic/xxx',
  topic_add: '/v1/topic/add',
  topic_reply: '/v1/reply/add',
  board: '/v1/board',
  topic_update: '/v1/topic/update',
  topic_delete: '/v1/topic/delete',
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
let host
if (import.meta.env.DEV) {
  host = 'http://127.0.0.1:5000'
} else {
  host = 'http://xi9li.com'
}

for (const key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key]
  }
}

export { url }
