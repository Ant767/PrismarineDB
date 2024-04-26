<div align="center">

![repository-open-graph-template(3)(1)](https://github.com/Azalea-Essentials/PrismarineDB/assets/122332042/32ba8402-0c51-47ff-b2af-88d29519b8b5)

</div

## About

PrismarineDB is a database designed to feel similar to [mongoose](https://npmjs.com/package/mongoose). Instead of being a key-value database like most MCBE databases, it uses documents like what MongoDB does.

## Usage

### Creating a table

```js
let table = prismarineDB.table("table")
```

### Inserting a document

```js
table.insertDocument({
  key1: "test"
})
```

### Finding a document

1. Find all documents matching a query
```js
let document = table.findDocuments({
  key: "value"
})
```

2. Find first document matching a query
```js
let document = table.findFirst({
  key: "value"
})
```

## Scripts using PrismarineDB
- [Azalea Essentials](https://github.com/Azalea-Essentials/Azalea) by [Ant767](https://github.com/Ant767)

> [!NOTE]
> This project is not in any way related to [PrismarineJS](https://github.com/PrismarineJS/). It just has a similar name
