/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  collection.updateRule = "@request.auth.creator = true"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "h4w3ylmr",
    "name": "user_input_instructions",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  collection.updateRule = ""

  // remove
  collection.schema.removeField("h4w3ylmr")

  return dao.saveCollection(collection)
})
