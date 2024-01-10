/* eslint-disable */
/// <reference path="../pb_data/types.d.ts" />

// artwork view hook
onRecordViewRequest((e) => {
  const { record } = e;
  if (record) {
    record.set("views", record.getInt("views") + 1);
    $app.dao().saveRecord(record);
  }
}, "artworks");
