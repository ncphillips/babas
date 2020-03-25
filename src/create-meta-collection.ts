import {
  createCollection,
  Collection,
  CollectionMethodsCreator,
} from './create-collection'

export interface MetaCollection<Entry, Methods> {
  [key: string]: Collection<Entry, Methods>
}

interface ID {
  __type: string
}

export function createMetaCollection<Entry, Methods>(
  methods?: CollectionMethodsCreator<Entry, Methods>
) {
  let meta = new Proxy<MetaCollection<Entry, Methods & ID>>(
    {},
    {
      get(meta, collectionId: string) {
        if (!meta[collectionId]) {
          meta[collectionId] = createCollection<Entry, Methods & ID>(
            {},
            col => {
              let colProps: any = methods ? methods(col) : {}

              colProps.id = collectionId

              return colProps
            }
          )
        }
        return meta[collectionId]
      },
      set() {
        return false
      },
      deleteProperty() {
        return false
      },
    }
  )
  return meta
}
