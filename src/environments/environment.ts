// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
declare const require: any;
export const environment = {
  production: false,
  version: require("../../package.json").version,
  seed_data: false,
  stitch_app_id: "random-poetry-yaqhp",
  db_name: "random-poetry",
  poem_collection: "poems",
  log_level: 2 // 0 - prod (only error) ; 1-error + warn + info ; 2 - all
};
