/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  collection.updateRule = "@request.auth.creator = true"

  return dao.saveCollection(collection)
})
