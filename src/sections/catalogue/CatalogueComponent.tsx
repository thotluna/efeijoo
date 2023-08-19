import { GetCatalogue } from '@mod-catalogue/application'
import { BookCatalogue, Catalogue, CatalogueRepository, FiltersState, Gender } from '@mod-catalogue/domain'
import { useEffect, useState } from 'react'
import { Filters } from '../Filters'
import { CatalogoBookCollection } from './CatalogoBookCollection'
import { CatalogueEmpty } from './CatalogueEmpty'

interface Props {
  repository: CatalogueRepository
  toToggleBook: (book: BookCatalogue) => void
}

export function CatalogueComponent({ repository, toToggleBook }: Props) {
  const [state, setState] = useState<Catalogue>({ books: [], total: 0, avalaible: 0 })
  const [stateFilters, setStateFilters] = useState<FiltersState>({
    genders: [],
    nPages: 0,
    search: undefined
  })

  const [search, setSearch] = useState('')

  useEffect(() => {
    GetCatalogue(repository, stateFilters).then(setState)
  }, [repository, stateFilters])

  const isGenderHandler = (gender: Gender) => {
    return stateFilters.genders.includes(gender)
  }

  const onChangeGenderHandler = (gender: Gender) => {
    setStateFilters((prev) => {
      return {
        ...prev,
        genders: stateFilters.genders.includes(gender)
          ? stateFilters.genders.filter((g) => g !== gender)
          : stateFilters.genders.concat(gender)
      }
    })
  }

  const onChangePage = (nPages: number) => {
    setStateFilters((prev) => {
      return { ...prev, nPages }
    })
  }

  const onSearch = (search: string) => {
    setStateFilters((prev) => {
      return { ...prev, search }
    })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(search)
    }, 500)

    return () => clearTimeout(timeout)
  }, [search])

  return (
    <section className="flex flex-col">
      <header className="flex flex-wrap gap-2 items-end justify-start">
        <h2 className="text-4xl md:text-6xl ">Catalogo</h2>
        <h2 className="text-2xl text-slate-500">
          Libros Disponibles: {state.avalaible}/{state.total}
        </h2>
      </header>
      <Filters
        nPage={stateFilters.nPages}
        isChecked={isGenderHandler}
        onChangeGender={onChangeGenderHandler}
        onChangePage={onChangePage}
        search={search}
        setSearch={setSearch}
      />
      <CatalogueEmpty collection={state.books} />
      <CatalogoBookCollection collection={state.books} onAddReading={toToggleBook} />
    </section>
  )
}
