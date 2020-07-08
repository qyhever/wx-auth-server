function getResponse(...rest) {
  if (rest.length === 2) {
    const [success, msg] = rest
    return {
      success,
      data: null,
      msg
    }
  }
  const [success, data, msg] = rest
  return {
    success,
    data,
    msg
  }
}

module.exports = {
  getResponse
}
