import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
    query AllAuthors {
        allAuthors {
            name
            born
            bookCount
            id
        }
    }
`;

export const ALL_BOOKS = gql`
    query AllAuthors {
        allBooks {
            title
            author
            published
            id
        }
    }
`;
