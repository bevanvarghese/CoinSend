import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'ptk5byuq',
  dataset: 'production',
  apiVersion: 'v1',
  token:
    'skTZ53zkUG9tDfYznZ64Q2pdhIjcqExwVJeNzMwKzlHorPDkV5VhJNChL6spu6uRKtTUzfxz6nF4Rf6E6DVFNoEEUhfbvw0I5BAz6A2wU8b8knMfOArki1yPnGNHNbtpClRl1ZLOs12mv5qRhfu9NY54klXKNzVlqL7ptSveE100baHiiljI',
  useCdn: false,
})
