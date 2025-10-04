const DataLoader = require("dataloader");
const Book = require("./models/book");

const bookCountLoader = new DataLoader((ids) => {
    return Book.find({ author: { $in: ids } }).then((books) => {
        return ids.map(
            (id) =>
                books.filter((b) => b.author.toString() === id.toString())
                    .length
        );
    });

    //ritorno arrey con il count nel stesso ordine degli ids
});

module.exports = () => bookCountLoader;
