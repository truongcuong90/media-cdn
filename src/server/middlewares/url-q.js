import sh from 'shorthash'
import { URL } from 'url'

const isMatch = (origin, domain) => {
  const pattern = origin
    .replace(/\./g, '\\.')
    .replace(/\*/g, '(.+)')

  const regex = new RegExp(pattern)

  return regex.test(domain)
}

export default async (req, res, next) => {
  const { query } = req
  const url = query.url || query.src

  if (!url) {
    // bad request
    return res.sendStatus(400)
  }

  const { hostname } = new URL(url)
  const { project } = req._params

  const allowOrigin = project.origins.length === 0 || project.origins.some(o => isMatch(o, hostname))

  if (!allowOrigin) {
    // forbidden
    return res.sendStatus(403)
  }

  req._params = {
    ...req._params,
    url: url,
    urlHash: sh.unique(url)
  }

  next()
}
