/*
* Author: Vasyl Onufriyev
* Date: 3-15-2019
* Purpose: Mock "Database" as a proof of concept
*/

var deployed = [ //keeps track of deployed machine IDs and their IPs
    { 'id': '0', 'UUID': 'NjedYrZSTPKRpPytOVQ4uxOsEP2kUqes', 'ip': '223.54.168.18', 'flag': null },
    { 'id': '1', 'UUID': 'Q9h8Snpqw0QWijgRRLuKokixayGSXBso', 'ip': '26.236.19.187', 'flag': null },
    { 'id': '2', 'UUID': '4I73K4lT0RuU7FtbpTGsMNqZTc1Os7cf', 'ip': '94.227.218.68', 'flag': null },
    { 'id': '3', 'UUID': 'uliWHXaNAEmtQxP943kC6aPFNkB89tJb', 'ip': '245.165.152.187', 'flag': null }
];

var keyset = [ //Keylist of systems that have yet to connect yet and deploy
    't1kkzVUGoebS0yavApTiQEr9lQ2Jw4G0',
    'YabG9CdIz6JAC19RSZJtVoY6Dz93tEvT',
    'uSttetVj3V0LOQDZvPQzl3Oas2cIHepA'
];

module.exports = { deployed, keyset }