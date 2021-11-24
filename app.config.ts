export const AppConfig = {
  clickhouse: {
    url: 'http://localhost',
    port: 8123,
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    format: "json", // "json" || "csv" || "tsv"
    raw: false,
    config: {
      // session_id: 'session_id if neeed',
      session_timeout: 60,
      output_format_json_quote_64bit_integers: 0,
      enable_http_compression: 0,
      database: 'my_test',
    },
  }
}

