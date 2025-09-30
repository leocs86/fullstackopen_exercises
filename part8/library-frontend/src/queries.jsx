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
    query AllBooks($genre: String) {
        allBooks(genre: $genre) {
            title
            author {
                name
            }
            published
            id
            genres
        }
    }
`;

export const ME = gql`
    query Me {
        me {
            username
            favoriteGenre
            id
        }
    }
`;
