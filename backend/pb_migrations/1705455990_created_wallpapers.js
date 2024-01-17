/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ogs3cfy8l3jo32k",
    "created": "2024-01-17 01:46:30.155Z",
    "updated": "2024-01-17 01:46:30.155Z",
    "name": "wallpapers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "kxurmv6q",
        "name": "artwork",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "eo6iaxf4pkeqynf",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ogs3cfy8l3jo32k");

  return dao.deleteCollection(collection);
})
