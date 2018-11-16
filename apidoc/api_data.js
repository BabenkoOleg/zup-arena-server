define({ "api": [  {    "type": "post",    "url": "/api/auth",    "title": "Request User authorization through the steam ticket",    "name": "GetJWT",    "version": "0.1.0",    "group": "Auth",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "ticket",            "description": "<p>Convert the ticket from GetAuthSessionTicket from binary to hex into an appropriately sized byte character array and pass the result in as this ticket parameter.</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n  \"ticket\": \"14000000252D6B3A43B98070A3DE8716010010012659DB5B18...\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "jwt",            "description": "<p>JSON Web Token (JWT)</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"jwt\": \"xxx.yyy.zzz\"\n}",          "type": "json"        }      ]    },    "filename": "./src/controllers/authController.js",    "groupTitle": "Auth"  },  {    "type": "post",    "url": "/api/matches",    "title": "Request create Match",    "name": "CreateMatch",    "version": "0.1.0",    "group": "Match",    "permission": [      {        "name": "Authorized users only"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Server-signed authentication token</p>"          }        ]      },      "examples": [        {          "title": "Header-Example:",          "content": "{\n  \"Authorization\": \"Bearer xxx.zzz.yyy\"\n}",          "type": "json"        }      ]    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "users",            "description": "<p>List of user's steamIds or Array of lists of user's steamIds</p>"          }        ]      },      "examples": [        {          "title": "Request-Example",          "content": "{\n  \"users\": [[\"12345678901234567\"], [\"12345678901234568\"]]\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>Unique match ID</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n  {\n    \"id\": \"5bde329b36dea19ab15d6ddb\"\n  }",          "type": "json"        }      ]    },    "filename": "./src/controllers/matches.js",    "groupTitle": "Match"  },  {    "type": "post",    "url": "/api/matches/:id/death",    "title": "Report the death",    "name": "DeathUser",    "description": "<p>Report that the current user has been killed by another user</p>",    "version": "0.1.0",    "group": "Match",    "permission": [      {        "name": "Authorized users only"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Server-signed authentication token</p>"          }        ]      },      "examples": [        {          "title": "Header-Example:",          "content": "{\n  \"Authorization\": \"Bearer xxx.zzz.yyy\"\n}",          "type": "json"        }      ]    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "killer",            "description": "<p>Killer user steamId</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n  \"killer\": \"12345678901234567\"\n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK",          "type": "json"        }      ]    },    "filename": "./src/controllers/matches.js",    "groupTitle": "Match"  },  {    "type": "post",    "url": "/api/matches/:id/finish",    "title": "Request finish Match",    "name": "FinishMatch",    "version": "0.1.0",    "group": "Match",    "permission": [      {        "name": "Authorized users only"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Server-signed authentication token</p>"          }        ]      },      "examples": [        {          "title": "Header-Example:",          "content": "{\n  \"Authorization\": \"Bearer xxx.zzz.yyy\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "success",            "description": "<p>Successful execution of the request</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Match information</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.id",            "description": "<p>Unique match ID</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "data.state",            "description": "<p>State of match</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n  {\n     \"success\": true,\n     \"data\": {\n         \"id\": \"5bde2fe8191c439993275761\",\n         \"state\": \"finished\"\n     }\n }",          "type": "json"        }      ]    },    "filename": "./src/controllers/matches.js",    "groupTitle": "Match"  },  {    "type": "post",    "url": "/api/matches/:id/kill",    "title": "Report the kill",    "name": "KillUser",    "description": "<p>Report that the current user has killed another user</p>",    "version": "0.1.0",    "group": "Match",    "permission": [      {        "name": "Authorized users only"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Server-signed authentication token</p>"          }        ]      },      "examples": [        {          "title": "Header-Example:",          "content": "{\n  \"Authorization\": \"Bearer xxx.zzz.yyy\"\n}",          "type": "json"        }      ]    },    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "target",            "description": "<p>Killed user steamId</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n  \"target\": \"12345678901234567\"\n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK",          "type": "json"        }      ]    },    "filename": "./src/controllers/matches.js",    "groupTitle": "Match"  },  {    "type": "get",    "url": "/api/matches/:id/credentials",    "title": "Request credentials",    "name": "MatchCredentials",    "version": "0.1.0",    "group": "Match",    "permission": [      {        "name": "Authorized users only"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Server-signed authentication token</p>"          }        ]      },      "examples": [        {          "title": "Header-Example:",          "content": "{\n  \"Authorization\": \"Bearer xxx.zzz.yyy\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>256-bit secret key</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "iv",            "description": "<p>Vector (16-bytes)</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n  {\n    \"key\": \"42-DC-64-3A-DF-DE-B4-F0-7A-78...\",\n    \"iv\": \"B0-7B-39-FC-6B-72-9E-5E-17-93...\"\n  }",          "type": "json"        }      ]    },    "filename": "./src/controllers/matches.js",    "groupTitle": "Match"  },  {    "type": "post",    "url": "/api/matches/:id/round",    "title": "Report the new round",    "name": "NextRound",    "description": "<p>Report the end of the current round and the beginning of a new one.</p>",    "version": "0.1.0",    "group": "Match",    "permission": [      {        "name": "Authorized users only"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Server-signed authentication token</p>"          }        ]      },      "examples": [        {          "title": "Header-Example:",          "content": "{\n  \"Authorization\": \"Bearer xxx.zzz.yyy\"\n}",          "type": "json"        }      ]    },    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK",          "type": "json"        }      ]    },    "filename": "./src/controllers/matches.js",    "groupTitle": "Match"  },  {    "type": "get",    "url": "/api/profile",    "title": "Request User information",    "name": "GetProfile",    "version": "0.1.0",    "group": "Profile",    "permission": [      {        "name": "Authorized users only"      }    ],    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Server-signed authentication token</p>"          }        ]      },      "examples": [        {          "title": "Header-Example:",          "content": "{\n  \"Authorization\": \"Bearer xxx.zzz.yyy\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>Unique user ID</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "steamId",            "description": "<p>ID in the Steam system</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "level",            "description": "<p>Current level</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "money",            "description": "<p>Amount of game currency</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "rank",            "description": "<p>Current rank</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "xp",            "description": "<p>Amount of experience</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "availableNewLootboxes",            "description": "<p>Amount of available lootboxes</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "activeMatchId",            "description": "<p>ID of current match or null</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n  \"id\": \"5be1ea22eebdda6c47c3cdfe\",\n  \"steamId\": \"12345678901234567\",\n  \"level\": 0,\n  \"money\": 0,\n  \"rank\": 0,\n  \"xp\": 0,\n  \"availableNewLootboxes\": 0,\n  \"activeMatchId\": \"5be1ea22eebdda6c47c3cdfd\"\n}",          "type": "json"        }      ]    },    "filename": "./src/controllers/profileController.js",    "groupTitle": "Profile"  }] });
