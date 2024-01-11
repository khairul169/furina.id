/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("eo6iaxf4pkeqynf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ovwal2or",
    "name": "caption",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("eo6iaxf4pkeqynf")

  // remove
  collection.schema.removeField("ovwal2or")

  return dao.saveCollection(collection)
})
