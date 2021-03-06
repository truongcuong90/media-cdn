import da from 'services/da'

export default async (req, res, next) => {
  const { hash, project: { _id } } = req._params

  const preset = req._params.preset = await da.getPreset(hash, _id)

  if (!preset) {
    return res.sendStatus(400)
  }

  next()
}
