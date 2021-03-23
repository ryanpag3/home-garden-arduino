# Home Garden Arduino

This code runs my home garden.

`api-adapter` sends command messages to the `arduino` which sends back telemetry as needed. Telemetry gets stored in postgres.

`web` queries the `api-adapter` service to display graphs and allow for on-demand watering.

This code is unfinished and unpolished. Your mileage may vary.