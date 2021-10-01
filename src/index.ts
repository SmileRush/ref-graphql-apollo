import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'

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
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.수

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
}

startApolloServer(typeDefs, resolvers)
