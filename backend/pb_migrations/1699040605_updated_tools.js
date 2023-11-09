/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  collection.listRule = "@request.auth.creator = true"
  collection.viewRule = "@request.auth.creator = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
})
