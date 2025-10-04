import { gql } from "@apollo/client";

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            title
            published
            id
            genres
            author {
                name
                born
                id
                bookCount
            }
        }
    }
`;
