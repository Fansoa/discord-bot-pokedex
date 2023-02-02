const fetchUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      } })
    const responseJSON = await response.json()
    return { data: responseJSON, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

module.exports = {
  fetchUrl
}
