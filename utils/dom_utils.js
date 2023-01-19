const byId = (id) => {
  return document.getElementById(id)
}

const byQuery = (query, allToggle = false) => {
  if (allToggle) return document.querySelectorAll(query)
  return document.querySelector(query)
}

const returnLength = (nodeList) => {
  return [...nodeList].length
}

const makeId = async (length) => {
  let result = ''
  const sequence =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < length; i++) {
    result += sequence.charAt(Math.floor(Math.random() * sequence.length))
  }
  return result
}

const makeHttpRequest = async (url, options) => {
  try {
    const response = await fetch(url, options)
    return response.json()
  } catch (e) {
    console.log(e.message)
  }
}

export { byId, byQuery, makeId, returnLength, makeHttpRequest }
