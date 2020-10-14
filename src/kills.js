const http = require('http-request')
const postgres = require('./postgres')
var _systemKillsTimer = null;
const KILL_INFO = {}
const SYSTEM_ID_TO_NAME = {}
const SYSTEM_SET = new Set()
const SYSTEM_NAME_TO_ID = {}
exports.init = () => {
  if (_systemKillsTimer) {
    return
  }
  const _sysKills = () => {
    http.get("https://esi.evetech.net/latest/universe/system_kills/?datasource=tranquility", (error, response) => {
      if (error){
        console.log("Error", err)
      }
      var js = JSON.parse(response.buffer.toString())
      console.log("System Kill Info fetched: ",js.length)
      Array.from(SYSTEM_SET).forEach( item => {
        KILL_INFO[SYSTEM_ID_TO_NAME[item]] = {
          npc_kills: 0,
          pod_kills: 0,
          ship_kills: 0,
          system_id: SYSTEM_NAME_TO_ID[item]
        }
      })
      js.map( item => {
        KILL_INFO[SYSTEM_ID_TO_NAME[item.system_id]] = {
          npc_kills: item.npc_kills || 0,
          pod_kills: item.pod_kills || 0,
          ship_kills: item.ship_kills || 0,
          system_id: item.system_id
        }
      }) // end map
    })
  }
  postgres.query('SELECT "solarSystemID", "solarSystemName" from evesde."mapSolarSystems";', (success) => {
    console.log("Systems Fetched: ", success.rows.length)
    success.rows.map( s => {
      SYSTEM_NAME_TO_ID[s.solarSystemName] = s.solarSystemID
      SYSTEM_ID_TO_NAME[s.solarSystemID] = `${s.solarSystemName.toLowerCase()}`;
      SYSTEM_SET.add(`${s.solarSystemName.toLowerCase()}`)
    } );
    _sysKills()
    _systemKillsTimer = setInterval( _sysKills, 60*60*1000)
  }, (e) => {console.error(e);});
  console.log("Initializing Kills Scripts")
  
}

exports.getSystemMetadata = (message, systemName) => {
  systemName = systemName.toLowerCase()
  subgroup = Array.from(SYSTEM_SET).filter( s => {
    return s.toLowerCase().includes(systemName)
  });
  if (subgroup.length > 0) {
    const _string = subgroup.map( _s => {
      var d = KILL_INFO[_s] || {
        npc_kills: 0,
        pod_kills: 0,
        ship_kills: 0,
        system_id: null
      }
      return `System: ${_s.toUpperCase()}:\nNPC Rats Killed: ${d.npc_kills}\nPlayer Ships Killed: ${d.ship_kills}\nPlayers Podded: ${d.pod_kills}`
    }).join("\n\n")
    message.reply('', {code:_string})
  } else {
    message.reply('Possible Misspelling of System.')
  }
}

