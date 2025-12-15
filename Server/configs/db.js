import {neon} from '@neondatabase/serverless'

const sql = neon(`${process.env.DATABASE_URL}`)

export default sql;
// 3:35:01
// npm run dev (client)
// npm run server 