/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3eugwfhwf18d81")

  // remove
  collection.schema.removeField("vsbbhp6t")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wknsafc8",
    "name": "user_template",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vsbbhp6t",
    "name": "user_template",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("wknsafc8")

  return dao.saveCollection(collection)
})
