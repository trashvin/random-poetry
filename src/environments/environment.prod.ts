declare const require: any;
export const environment = {
  production: true,
  version: require("../../package.json").version,
  seed_data: false,
  stitch_app_id: "random-poetry-yaqhp",
  db_name: "random-poetry",
  poem_collection: "poems",
  log_level: 0 // 0 - prod (only error) ; 1-error + warn + info ; 2 - all
};
