import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: 5432,
})

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

  console.log('started')
}

const typeDefs = gql`
  ${fs.readFileSync(path.resolve(__dirname, 'book.graphql'))}
`

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    // _ : 명시적으로 안쓰는거 표현.
    // args : 2번째 parameter 값, 변수명일 뿐.
    books: async (_: any, args: any) => {
      console.log('args', args)
      // const result = await pool.query('SELECT * FROM book WHERE id = $1', [1])
      // console.log('result', result)
    },
  },
}

startApolloServer(typeDefs, resolvers)
