import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import { Pool } from 'pg'

import bookTypeDefs from './book.graphql'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
})

pool
  .query('SELECT NOW()')
  .then((result) => console.log(result.rows))
  .catch((error) => console.log(error))

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  await server.start()
  server.applyMiddleware({ app })
  await new Promise((resolve) =>
    app.listen(process.env.PORT ?? 4000, resolve as any)
  )

  console.log('started !! @@@@')
}

const typeDefs = gql`
  ${bookTypeDefs}
`

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    // _ : 명시적으로 안쓰는거 표현.
    // args : 2번째 parameter 값, 변수명일 뿐.
    // # variables가 args로 바로 들어오는구나~~
    books: async () => {
      return []
    },
    book: async (_: any, args: any) => {
      const result = await pool.query('SELECT * FROM book WHERE id = $1', [
        args.id,
      ]) // $1, $2, $3, ... 순서 그대로 쓰자~~
      console.log('result', result)
      return result.rows[0]
    },
  },

  Mutation: {
    createBook: async (_: any, args: any) => {
      const result = await pool.query(
        'INSERT INTO book (title, author) VALUES ($1, $2) RETURNING id',
        [args.title, args.author]
      )
      return result.rows[0].id // 성공하면 id, 실패하면 error
    },
    deleteBook: async (_: any, args: any) => {
      const result = await pool.query(
        'DELETE FROM book WHERE id=$1 RETURNING id',
        [args.id]
      )
      return result.rows[0].id
    },
  },
}

startApolloServer(typeDefs, resolvers)
