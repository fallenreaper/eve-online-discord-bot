exports.alert = (message, args) => {
  let [channel, date, eveTime, frequency, ...contentArr] = args;
  const localMessage = contentArr.join(" ");
  const content = localMessage.replace(/ALL/g, "@everyone");
  let channelSelection = Array.from(
    message.channel.guild.channels.cache.values()
  ).filter((channelMetadata) => {
    return channelMetadata.name.toLowerCase() === channel;
  });

  if (channelSelection.length === 0) {
    message.reply("Channel Not Found.");
    return;
  }
  // Below is an Object containing channel info.
  const broadcastChannel = channelSelection[0];

  const MINUTE = 1000 * 60;
  if (eveTime.length === 4) {
    eveTime = `${eveTime.substring(0, 2)}:${eveTime.substring(3)}`;
  }
  d = new Date(`${date} ${eveTime} UTC`);

  var _intervals = Array.from(
    new Set(
      frequency
        .split(",")
        .map((i) => {
          try {
            return parseFloat(i);
          } catch (e) {
            return null;
          }
        })
        .filter((i) => i !== null)
    )
  ).sort((a, b) => b - a);
  if (_intervals.length === 0) {
    message.reply(
      "Interval is incorrect.  Need to be a comma delimited list of floats."
    );
    return;
  }

  const sendMessage = (_channel, _message) => {
    try {
      _channel.send(_message);
    } catch (e) {
      console.log("Error with sending a message. ", e);
    }
  };
  const messageFunction = (arr, _channel, _message) => {
    const old = arr.shift();
    sendMessage(_channel, _message);
    if (arr.length === 0) return;
    setTimeout(() => {
      messageFunction(arr, _channel, _message);
    }, MINUTE * (old - arr[0]));
  };
  const _timeoutInitialTimer =
    d - new Date(Date.now()) - MINUTE * _intervals[0];
  _timer = setTimeout(() => {
    messageFunction(_intervals, broadcastChannel, content);
  }, _timeoutInitialTimer);
  message.reply(
    `Alert Established.\nChannel (${broadcastChannel.name})\nDatetime(${d})\nMinutes Leading up(${_intervals})\nMessage: ${content}`
  );
};
