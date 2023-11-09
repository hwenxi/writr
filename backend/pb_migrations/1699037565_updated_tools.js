/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_lumfoB0` ON `tools` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  collection.indexes = [
    "CREATE INDEX `idx_lumfoB0` ON `tools` (`name`)"
  ]

  return dao.saveCollection(collection)
})
